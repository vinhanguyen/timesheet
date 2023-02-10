export function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const dateString = date.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });
  const timeString = date.toLocaleTimeString('en-US');
  return `${dateString} ${timeString}`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US' , {style: 'currency', currency: 'USD'}).format(value);
}

export function getHms(time: number) {
  const sec = 1000;
  const min = sec*60;
  const hour = min*60;

  const hours = time/hour;
  const mins = (time%hour)/min;
  const secs = ((time%hour)%min)/sec;

  return [Math.floor(hours), Math.floor(mins), Math.floor(secs)];
}

export function msToHours(ms: number) {
  return ms/(1000*60*60);
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
