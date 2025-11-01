// src/services/authService.js
import { apiRequest } from "./api";

function getAllJadwal() {
    return apiRequest("jadwal", "GET");
}

// Method TEST untuk debugging - return parameter yang dikirim
function testSearchParams(searchParams) {
    console.log('=== TEST SEARCH PARAMS ===');
    console.log('Parameters yang dikirim:', searchParams);
    
    const mockResponse = {
        success: true,
        message: 'Test parameter berhasil',
        receivedParams: {
            tripType: searchParams.tripType,
            from: searchParams.from,
            to: searchParams.to,
            date: searchParams.date,
            passengers: searchParams.passengers
        },
        timestamp: new Date().toISOString()
    };
    
    console.log('Mock response:', mockResponse);
    
    return Promise.resolve(mockResponse);
}

export default {
    getAllJadwal,
    testSearchParams
}