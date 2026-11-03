import React, { lazy, Suspense } from 'react';
import type AdminModalComponent from './AdminModal';
const AdminModal = lazy(() => import('./AdminModal'));

export default function LazyAdminModal(props: React.ComponentProps<typeof AdminModalComponent>) {
  if (!props.isOpen) return null;
  return <Suspense fallback={<div role="status" className="fixed bottom-4 left-4 z-50 rounded-xl bg-white p-4 shadow-lg">{props.isGreek ? 'Φόρτωση…' : 'Loading…'}</div>}>
    <AdminModal {...props} />
  </Suspense>;
}
