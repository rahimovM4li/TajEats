import type { Restaurant } from '@/types/domain';

/**
 * Check if a restaurant is currently open based on opening hours
 */
export const isRestaurantOpenNow = (restaurant: Restaurant): boolean => {
  // If manually closed by owner, respect that
  if (!restaurant.isOpen) {
    return false;
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes since midnight

  // Map day numbers to opening hours fields
  const dayFields = [
    restaurant.openingSunday,    // 0 = Sunday
    restaurant.openingMonday,    // 1 = Monday  
    restaurant.openingTuesday,   // 2 = Tuesday
    restaurant.openingWednesday, // 3 = Wednesday
    restaurant.openingThursday,  // 4 = Thursday
    restaurant.openingFriday,    // 5 = Friday
    restaurant.openingSaturday,  // 6 = Saturday
  ];

  const todayHours = dayFields[currentDay];

  // If no hours specified for today or empty, restaurant is closed
  if (!todayHours || !todayHours.trim()) {
    return false;
  }

  // Parse opening hours format: "09:00-22:00"
  const timeMatch = todayHours.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
  if (!timeMatch) {
    // Invalid format, assume closed
    return false;
  }

  const [, openHour, openMin, closeHour, closeMin] = timeMatch;
  const openTime = parseInt(openHour) * 60 + parseInt(openMin);
  const closeTime = parseInt(closeHour) * 60 + parseInt(closeMin);

  // Handle overnight hours (e.g., 22:00-02:00)
  if (closeTime <= openTime) {
    // Overnight: open if current time >= open time OR current time < close time
    return currentTime >= openTime || currentTime < closeTime;
  } else {
    // Regular hours: open if current time is between open and close
    return currentTime >= openTime && currentTime < closeTime;
  }
};

/**
 * Get the opening status text for display
 */
export const getOpenStatusText = (restaurant: Restaurant): { text: string; isOpen: boolean } => {
  const isOpen = isRestaurantOpenNow(restaurant);
  
  if (!restaurant.isOpen) {
    return { text: 'Temporarily Closed', isOpen: false };
  }
  
  if (isOpen) {
    return { text: 'Open', isOpen: true };
  }
  
  // Restaurant has hours but is currently closed
  const now = new Date();
  const currentDay = now.getDay();
  
  const dayFields = [
    restaurant.openingSunday, restaurant.openingMonday, restaurant.openingTuesday,
    restaurant.openingWednesday, restaurant.openingThursday, restaurant.openingFriday, restaurant.openingSaturday
  ];

  const todayHours = dayFields[currentDay];
  
  if (todayHours && todayHours.trim()) {
    const timeMatch = todayHours.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
    if (timeMatch) {
      const [, openHour, openMin] = timeMatch;
      return { text: `Opens at ${openHour}:${openMin}`, isOpen: false };
    }
  }
  
  // Find next opening day
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDay + i) % 7;
    const nextDayHours = dayFields[nextDayIndex];
    
    if (nextDayHours && nextDayHours.trim()) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = i === 1 ? 'Tomorrow' : dayNames[nextDayIndex];
      
      const timeMatch = nextDayHours.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
      if (timeMatch) {
        const [, openHour, openMin] = timeMatch;
        return { text: `Opens ${dayName} ${openHour}:${openMin}`, isOpen: false };
      }
    }
  }
  
  return { text: 'Closed', isOpen: false };
};