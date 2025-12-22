// industry-selection.js

// Utility: Check for localStorage support
function storageAvailable(type) {
  try {
    var storage = window[type], x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

// Utility: Set and get industry preference
function setIndustryPreference(industry) {
  if (storageAvailable('localStorage')) {
    localStorage.setItem('industry', industry);
  } else {
    // Fallback: Use a session cookie (expires on browser close)
    document.cookie = `industry=${industry}; path=/`;
  }
}
function getIndustryPreference() {
  if (storageAvailable('localStorage')) {
    return localStorage.getItem('industry');
  } else {
    // Fallback: Read from cookie
    const match = document.cookie.match(/(?:^|; )industry=([^;]*)/);
    return match ? match[1] : null;
  }
}
function clearIndustryPreference() {
  if (storageAvailable('localStorage')) {
    localStorage.removeItem('industry');
  }
  document.cookie = 'industry=; Max-Age=0; path=/';
}

// Redirect logic
function redirectToIndustry(industry) {
  document.getElementById('loading').classList.remove('hidden');
  setTimeout(() => {
    window.location.assign(`./${industry}/index.html`);
  }, 500); // brief delay for UX
}

// On page load: auto-redirect if preference exists
document.addEventListener('DOMContentLoaded', function() {
  const industry = getIndustryPreference();
  if (industry === 'healthcare' || industry === 'utility') {
    redirectToIndustry(industry);
    return;
  }

  // Attach event listeners for selection buttons
  document.getElementById('select-healthcare').addEventListener('click', function() {
    setIndustryPreference('healthcare');
    redirectToIndustry('healthcare');
  });
  document.getElementById('select-utility').addEventListener('click', function() {
    setIndustryPreference('utility');
    redirectToIndustry('utility');
  });
});

// Optional: Add a "Change Industry" link on /healthcare and /utility pages
// Example HTML: <a href="/" onclick="clearIndustryPreference()">Change Industry</a>
window.clearIndustryPreference = clearIndustryPreference;
