import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, platform } = await request.json();
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CalendarSync/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch calendar');
    }
    
    const icsContent = await response.text();
    const events = parseICSContent(icsContent, platform);
    
    return NextResponse.json({ 
      success: true, 
      events,
      message: `Synced ${events.length} events from ${platform}`
    });
    
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { success: false, error: 'Failed to sync calendar' },
      { status: 500 }
    );
  }
}

const parseICSDate = (dateStr: string) => {
  return new Date(
    parseInt(dateStr.slice(0, 4)),
    parseInt(dateStr.slice(4, 6)) - 1,
    parseInt(dateStr.slice(6, 8))
  );
};

function parseICSContent(icsContent: string, platform: string) {
  const events = [];
  const eventBlocks = icsContent.split('BEGIN:VEVENT');
  
  for (let i = 1; i < eventBlocks.length; i++) {
    const event = eventBlocks[i];
    const startMatch = event.match(/DTSTART[;:].*?(\d{8})/);
    const endMatch = event.match(/DTEND[;:].*?(\d{8})/);
    const summaryMatch = event.match(/SUMMARY:(.*)/);
    
    if (startMatch && endMatch) {
      const startDate = parseICSDate(startMatch[1]);
      const endDate = parseICSDate(endMatch[1]);
      const summary = summaryMatch ? summaryMatch[1].trim() : 'Blocked';
      
     
      const dates = [];
      const currentDate = new Date(startDate);
      while (currentDate < endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      events.push(...dates.map(date => ({
        date: date.toISOString().slice(0, 10),
        source: summary.includes('Airbnb') ? 'airbnb' : 
                summary.includes('VRBO') ? 'vrbo' : 'other',
        summary
      })));
    }
  }
  
  return events;
};
