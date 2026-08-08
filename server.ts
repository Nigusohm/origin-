import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { sendEmail } from "./src/lib/resend";
import { initializeChapaTransaction } from "./src/lib/chapa";
import { initializeStripePayment } from "./src/lib/stripe";
import { generateChatResponse } from "./src/lib/gemini";
import { INITIAL_PRODUCTS, INITIAL_CASE_STUDIES, INITIAL_RESOURCES, INITIAL_SLOTS, INITIAL_MEDIA_ITEMS } from "./src/data/mockData";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory backend stores for development / API fallbacks
  let productsStore = [...INITIAL_PRODUCTS];
  let caseStudiesStore = [...INITIAL_CASE_STUDIES];
  let resourcesStore = [...INITIAL_RESOURCES];
  let slotsStore = [...INITIAL_SLOTS];
  let bookingsStore: any[] = [];
  let ordersStore: any[] = [];
  let inquiriesStore: any[] = [];

  // API Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get Contact Inquiries (Admin/Inquiry list)
  app.get("/api/contact", (req, res) => {
    res.json({ success: true, count: inquiriesStore.length, inquiries: inquiriesStore });
  });

  // Contact API -> In-memory Inquiry Storage + Resend email + auto reply
  app.post("/api/contact", async (req, res) => {
    const { name, email, phone, subject, division, message } = req.body;
    
    // Server-side validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: "A valid email address is required." });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: "Message content is required." });
    }

    const inquiryId = `inq_${Date.now()}`;
    const newInquiry = {
      id: inquiryId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? String(phone).trim() : '',
      subject: subject ? String(subject).trim() : (division ? `${division.toUpperCase()} Inquiry` : 'General Inquiry'),
      division: division || 'corporate',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    inquiriesStore.unshift(newInquiry);

    let targetDivisionEmail = 'info@originandeverlasting.com';
    if (division === 'bvibe') targetDivisionEmail = 'bvibe@origin.et';
    if (division === 'tx') targetDivisionEmail = 'tx@origin.et';
    if (division === 'consulting') targetDivisionEmail = 'consulting@origin.et';

    try {
      // Send admin notification
      await sendEmail({
        to: targetDivisionEmail,
        subject: `[New Inquiry - ${newInquiry.subject}] From ${newInquiry.name}`,
        html: `
          <h2>New Contact Inquiry Received</h2>
          <p><strong>Inquiry ID:</strong> ${inquiryId}</p>
          <p><strong>Name:</strong> ${newInquiry.name}</p>
          <p><strong>Email:</strong> ${newInquiry.email}</p>
          <p><strong>Phone:</strong> ${newInquiry.phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${newInquiry.subject}</p>
          <p><strong>Division:</strong> ${newInquiry.division}</p>
          <p><strong>Message:</strong></p>
          <p>${newInquiry.message}</p>
        `
      });

      // Send auto-reply to client
      await sendEmail({
        to: newInquiry.email,
        subject: `Thank you for contacting Origin & Everlasting Trading PLC`,
        html: `
          <h3>Dear ${newInquiry.name},</h3>
          <p>Thank you for reaching out regarding <strong>"${newInquiry.subject}"</strong>.</p>
          <p>Our team at Origin & Everlasting Trading PLC has logged your inquiry (#${inquiryId}) and an executive representative will review it promptly.</p>
          <br/>
          <p>Best regards,<br/><strong>Origin & Everlasting Trading PLC Team</strong></p>
        `
      });
    } catch (err) {
      console.warn('[Contact API Email Notification Skipped/Failed]:', err);
    }

    res.json({
      success: true,
      message: "Inquiry submitted successfully.",
      inquiryId: newInquiry.id,
      inquiry: newInquiry
    });
  });

  // B2B Wholesale Quote API
  app.post("/api/quote", async (req, res) => {
    const { companyName, contactName, email, phone, estimatedUnits, productCategory, notes } = req.body;
    
    await sendEmail({
      to: 'bvibe@origin.et',
      subject: `[Wholesale RFQ] ${companyName} (${estimatedUnits} units)`,
      html: `
        <h2>New Wholesale B2B Quote Request</h2>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Contact:</strong> ${contactName} (${email}, ${phone})</p>
        <p><strong>Estimated Volume:</strong> ${estimatedUnits} units</p>
        <p><strong>Category:</strong> ${productCategory}</p>
        <p><strong>Notes:</strong> ${notes || 'None'}</p>
      `
    });

    res.json({ success: true, message: "Wholesale quote request logged. Our B-VIBE sales account executive will respond within 24 hours." });
  });

  // Live Booking API with atomic check
  app.post("/api/book", async (req, res) => {
    const { slotId, clientName, clientEmail, organization, role, sessionType, description } = req.body;

    const slotIndex = slotsStore.findIndex(s => s.id === slotId);
    if (slotIndex === -1) {
      return res.status(404).json({ error: "Slot not found" });
    }

    if (slotsStore[slotIndex].is_booked) {
      return res.status(409).json({ error: "This slot has already been booked by another client. Please select another time." });
    }

    const bookingId = `book_${Date.now()}`;
    const newBooking = {
      id: bookingId,
      slot_id: slotId,
      client_name: clientName,
      client_email: clientEmail,
      organization,
      role,
      session_type: sessionType,
      description,
      confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    // Mark slot as booked
    slotsStore[slotIndex].is_booked = true;
    bookingsStore.push(newBooking);

    // Email client
    await sendEmail({
      to: clientEmail,
      subject: `Booking Confirmed — Strategic Consulting Session (${sessionType})`,
      html: `
        <h2>Consulting Session Confirmation</h2>
        <p>Dear ${clientName},</p>
        <p>Your session has been successfully booked with Strategic Consulting Hub.</p>
        <ul>
          <li><strong>Date:</strong> ${slotsStore[slotIndex].date}</li>
          <li><strong>Time:</strong> ${slotsStore[slotIndex].time}</li>
          <li><strong>Session Type:</strong> ${sessionType}</li>
          <li><strong>Organization:</strong> ${organization || 'N/A'}</li>
        </ul>
        <p>An executive advisor will send calendar invites shortly.</p>
      `
    });

    res.json({ success: true, booking: newBooking });
  });

  // AI Chatbot API
  app.post("/api/chat", async (req, res) => {
    const { messages, divisionContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    const reply = await generateChatResponse(messages, divisionContext);
    res.json({ reply });
  });

  // Checkout API (Chapa ETB or Stripe USD)
  app.post("/api/checkout", async (req, res) => {
    const { items, payment_method, shipping, total_etb, total_usd } = req.body;

    const orderId = `oe_order_${Date.now()}`;
    const newOrder = {
      id: orderId,
      items,
      total_etb,
      total_usd,
      payment_method,
      payment_status: 'pending',
      shipping_address: shipping,
      created_at: new Date().toISOString()
    };

    ordersStore.push(newOrder);

    const baseUrl = process.env.APP_URL || `http://localhost:${PORT}`;

    if (payment_method === 'chapa') {
      const nameParts = (shipping.fullName || 'Valued Customer').split(' ');
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.slice(1).join(' ') || 'Order';

      const result = await initializeChapaTransaction({
        amount: total_etb,
        currency: 'ETB',
        email: shipping.email,
        first_name: firstName,
        last_name: lastName,
        tx_ref: orderId,
        callback_url: `${baseUrl}/api/webhook/chapa`,
        return_url: `${baseUrl}/garment/cart?success=true&order_id=${orderId}`,
        title: 'Origin & Everlasting — B-VIBE Garment',
        description: `Payment for Order #${orderId}`
      });

      return res.json({ checkout_url: result.checkout_url, orderId });
    } else {
      // Stripe USD
      const result = await initializeStripePayment({
        amount: total_usd,
        currency: 'usd',
        email: shipping.email,
        orderId
      });

      return res.json({ clientSecret: result.clientSecret, orderId });
    }
  });

  // Webhook Chapa
  app.post("/api/webhook/chapa", (req, res) => {
    const { tx_ref, status } = req.body;
    console.log('[Chapa Webhook Received]:', req.body);
    const order = ordersStore.find(o => o.id === tx_ref);
    if (order) {
      order.payment_status = status === 'success' ? 'paid' : 'failed';
    }
    res.json({ status: "processed" });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
