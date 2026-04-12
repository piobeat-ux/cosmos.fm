const API_URL = 'https://cosmosfm-production.up.railway.app/api';

async function getShows() {
  const res = await fetch(`${API_URL}/shows`);
  return res.json();
}

async function getCurrentShow() {
  const res = await fetch(`${API_URL}/shows/current`);
  return res.json();
}

async function getPodcasts() {
  const res = await fetch(`${API_URL}/podcasts`);
  return res.json();
}

async function addShow(data) {
  const res = await fetch(`${API_URL}/shows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}