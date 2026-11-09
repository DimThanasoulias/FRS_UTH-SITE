export function getEventLinkLabel(link: string, isGreek: boolean): string {
  let hostname = '';
  try {
    hostname = new URL(link).hostname.toLowerCase();
  } catch {}
  const belongsTo = (domain: string) => hostname === domain || hostname.endsWith(`.${domain}`);
  if (belongsTo('instagram.com')) {
    return isGreek ? 'Δείτε την εκδήλωση στο Instagram' : 'View Event on Instagram';
  }
  if (belongsTo('facebook.com') || belongsTo('fb.me')) {
    return isGreek ? 'Σελίδα Εκδήλωσης στο Facebook' : 'Facebook Event Page';
  }
  return isGreek ? 'Δείτε την εκδήλωση' : 'View Event';
}
