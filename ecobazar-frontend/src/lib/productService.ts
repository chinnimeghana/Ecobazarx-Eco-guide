async getProducts(): Promise<Product[] {
  const res = await fetch(`${API_BASE_URL}/products`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    // read response text to see what backend returned
    const errorText = await res.text();
    console.error('Backend error response:', errorText);
    throw new Error('Failed to fetch products');
  }

  const text = await res.text();
  try {
    return text ? JSON.parse(text) : [];
  } catch (err) {
    console.error('Invalid JSON from backend:', text);
    return [];
  }
}
