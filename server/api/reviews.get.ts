type OpenVsxUser = {
  loginName?: string;
  fullName?: string;
};

type OpenVsxReview = {
  rating?: number;
  timestamp?: string;
  comment?: string;
  user?: OpenVsxUser;
};

type Review = {
  author: string;
  datePublished: string;
  rating: number;
  body: string;
};

type ReviewsResponse = {
  reviewCount: number;
  ratingValue: number | null;
  reviews: Review[];
};

const OPEN_VSX_API = 'https://open-vsx.org/api/ackzell/tlapalli';

export default defineEventHandler(async (): Promise<ReviewsResponse> => {
  try {
    const [extension, reviewList] = await Promise.all([
      $fetch<{ reviewCount?: number }>(OPEN_VSX_API, { timeout: 5000 }),
      $fetch<{ reviews?: OpenVsxReview[] }>(`${OPEN_VSX_API}/reviews`, { timeout: 5000 }),
    ]);

    const reviews = (reviewList.reviews ?? []).filter(
      (review): review is OpenVsxReview & { rating: number; timestamp: string } =>
        typeof review.rating === 'number' && typeof review.timestamp === 'string',
    );

    const ratingValue =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 100,
          ) / 100
        : null;

    return {
      reviewCount: Math.max(extension.reviewCount ?? 0, reviews.length),
      ratingValue,
      reviews: reviews.map((review) => ({
        author: review.user?.fullName || review.user?.loginName || 'Anonymous',
        datePublished: review.timestamp,
        rating: review.rating,
        body: review.comment ?? '',
      })),
    };
  } catch {
    return { reviewCount: 0, ratingValue: null, reviews: [] };
  }
});
