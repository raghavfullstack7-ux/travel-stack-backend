async function getFlyingFlights() {
  try {
    const url = `${process.env.AVIATION_STACK_BASE_URL}?access_key=${process.env.AVIATION_STACK_API_KEY}`;

    const response = await fetch(url);
    const apiResponse = await response.json();

    console.log("API response received with", apiResponse?.data?.length, "flights");

    if (!Array.isArray(apiResponse.data)) {
      return [];
    }

    const flyingFlights = apiResponse.data.filter(
      (flight) => flight.flight_status === "active"
    );

    console.log("Fetched", flyingFlights.length, "active flights");

    return flyingFlights;
  } catch (error) {
    console.error("getFlyingFlights service error:", error.message);
    throw error;
  }
}

module.exports = { getFlyingFlights };