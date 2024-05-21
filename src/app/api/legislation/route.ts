import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const limit = request.nextUrl.searchParams.get('limit') || '10';
  const skip = request.nextUrl.searchParams.get('skip') || '0';
  const res = await fetch(`https://api.oireachtas.ie/v1/legislation?limit=${limit}&skip=${skip}`, { // Update the fetch URL with the limit and skip parameters
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const responseData = await res.json();
  // @ts-expect-error: Error
  const bills = responseData.results.map(item => item.bill);

  let simplifiedBills = [];
  if (bills && Array.isArray(bills)) {
    simplifiedBills = bills.map(item => {
        const { billNo, billType, sponsors, status, longTitleEn, longTitleGa, uri } = item;
        // @ts-expect-error: Error
        const primarySponsor = sponsors.find(item => item.sponsor.isPrimary);

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
  const response = {
    bills: simplifiedBills,
    total: responseData.head.counts.billCount,
  }
  return NextResponse.json(response);
}
