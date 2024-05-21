import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;
  const skip = Number(request.nextUrl.searchParams.get('skip')) || 0;
  const type = request.nextUrl.searchParams.get('type');

  // Fetch all data from the external API
  const res = await fetch(`https://api.oireachtas.ie/v1/legislation`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const responseData = await res.json();
  // @ts-expect-error: Error
  let bills = responseData.results.map((item) => item.bill);

  if (type) {
    // @ts-expect-error: Error
    bills = bills.filter((bill) => bill.billType.toLowerCase().includes(type.toLowerCase()));
  }

  let simplifiedBills = [];
  if (bills && Array.isArray(bills)) {
    simplifiedBills = bills.map((item) => {
      const { billNo, billType, sponsors, status, longTitleEn, longTitleGa, uri } = item;
      // @ts-expect-error: Error
      const primarySponsor = sponsors.find((item) => item.sponsor.isPrimary);

      let sponsorName = null;
      if (primarySponsor) {
        sponsorName = primarySponsor.sponsor.as.showAs || primarySponsor.sponsor.by.showAs;
      }

      const sponsor = sponsorName ? sponsorName : null;
      return { number: billNo, type: billType, sponsor, status, longTitleEn, longTitleGa, uri };
    });
  } else {
    simplifiedBills = bills;
  }

  const paginatedBills = simplifiedBills.slice(skip, skip + limit);
  const response = {
    bills: paginatedBills,
    total: responseData.head.counts.billCount,
  };
  return NextResponse.json(response);
}
