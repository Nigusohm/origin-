import { redirect } from 'next/navigation';

// The training division has been merged into Consulting & Training.
// Redirect old /training URL permanently to /consulting.
export default function TrainingRedirectPage() {
  redirect('/consulting');
}
