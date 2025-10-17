// This is a mock API endpoint to supply a list of notifications.
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const mockNotifications = [
    {
      id: 1,
      title: "New AI Recommendation",
      description: "Your campaign 'Summer Sale' has a new optimization suggestion.",
      read: false,
    },
    {
      id: 2,
      title: "Budget Alert",
      description: "You have used 80% of your monthly budget.",
      read: false,
    },
    {
      id: 3,
      title: "Campaign Ended",
      description: "Your 'Q2 Promo' campaign has finished.",
      read: true,
    },
    {
      id: 4,
      title: "New Insight Available",
      description: "Audience demographics for 'Social Media' have been updated.",
      read: true,
    },
  ];

  return NextResponse.json(mockNotifications);
}
