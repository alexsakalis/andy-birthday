export type AlexNotification = {
  id: string;
  bookId: string;
  couponId: string;
  couponTitle: string;
  note: string | null;
  redeemedAt: string;
  emailSentAt: string | null;
  readAt: string | null;
  createdAt: string;
};

export type AlexNotificationRow = {
  id: string;
  book_id: string;
  coupon_id: string;
  coupon_title: string;
  note: string | null;
  redeemed_at: string;
  email_sent_at: string | null;
  read_at: string | null;
  created_at: string;
};
