import { useEffect, useState, Suspense } from "react";
import GraphCard from "../components/GraphCard";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Topbar from "../components/Topbar";

function MachineLearning() {
    const CHANNEL_ID = import.meta.env.VITE_CHANNEL_ID;
    const API_KEY = import.meta.env.VITE_API_KEY;
    
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sensorData, setSensorData] = useState({});
    const [predictedData, setPredictedData] = useState({});

    // Add new state for date filter
    const [dateRange, setDateRange] = useState('24h');

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${API_KEY}&results=40`);
                const { feeds, channel } = response.data;

                // Process the data for each sensor
                const processedData = {
                    so2: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field1)
                    })),
                    pm25: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field2)
                    })),
                    pm10: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field3)
                    })),
                    co2: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field4)
                    })),
                    no2: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field5)
                    })),
                    o3: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field6)
                    })),
                    temperature: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field7)
                    })),
                    humidity: feeds.map(feed => ({
                        time: new Date(feed.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        fullDate: new Date(feed.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        value: parseFloat(feed.field8)
                    })),
                };

                setSensorData(processedData);
            } catch (err) {
                console.error("Error fetching data from Thingspeak:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [refresh]);

    const handleRefresh = () => {
        setRefresh(prev => prev + 1);
    };

    // Loading skeleton component
    const SkeletonCard = () => (
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
        </div>
    );

    // Function to generate dummy predictions
    const generateDummyPredictions = (actualData) => {
        if (!actualData || Object.keys(actualData).length === 0) return {};

        const generatePredictedValues = (data) => {
            return data.map(point => ({
                time: point.time,
                fullDate: point.fullDate,
                // Add some random variation to the actual value
                value: point.value * (3 + (Math.random() * 0.4 - 0.2)) // ±20% variation
            }));
        };

        return {
            so2: generatePredictedValues(actualData.so2),
            pm25: generatePredictedValues(actualData.pm25),
            pm10: generatePredictedValues(actualData.pm10),
            co2: generatePredictedValues(actualData.co2),
            no2: generatePredictedValues(actualData.no2),
            o3: generatePredictedValues(actualData.o3),
            temperature: generatePredictedValues(actualData.temperature),
            humidity: generatePredictedValues(actualData.humidity),
        };
    };

    // Replace the getPredictions function with this simplified version
    const getPredictions = async (sensorData) => {
        try {
            // Generate dummy predictions instead of making API call
            const dummyPredictions = generateDummyPredictions(sensorData);
            setPredictedData(dummyPredictions);
        } catch (error) {
            console.error("Error generating predictions:", error);
        }
    };

    useEffect(() => {
        if (!loading && Object.keys(sensorData).length > 0) {
            getPredictions(sensorData);
        }
    }, [sensorData, loading]);

    return (
        <div className="flex h-full bg-gray-100">
            <Sidebar />
            <div className="flex-1">
                {/* Top Navigation Bar */}
                <Topbar loading={loading} setRefresh={setRefresh} setDateRange={setDateRange} dateRange={dateRange} />

                {/* Main Content */}
                <div className="ml-64 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            // Show skeleton loading when data is being fetched
                            [...Array(8)].map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : (
                            // Show actual graph cards when data is loaded
                            <>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard 
                                        title="SO2 Levels" 
                                        data={sensorData.so2}
                                        predictedData={predictedData.so2}
                                        showPrediction={true}
                                    />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard 
                                        title="PM2.5 Levels" 
                                        data={sensorData.pm25}
                                        predictedData={predictedData.pm25}
                                        showPrediction={true}
                                    />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard title="PM10 Levels" data={sensorData.pm10} predictedData={predictedData.pm10} showPrediction={true} />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard title="CO2 Levels" data={sensorData.co2} predictedData={predictedData.co2} showPrediction={true} />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard title="NO2 Levels" data={sensorData.no2} predictedData={predictedData.no2} showPrediction={true} />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard title="O3 Levels" data={sensorData.o3} predictedData={predictedData.o3} showPrediction={true} />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard title="Temperature" data={sensorData.temperature} predictedData={predictedData.temperature} showPrediction={true} />
                                </Suspense>
                                <Suspense fallback={<SkeletonCard />}>
                                    <GraphCard title="Humidity" data={sensorData.humidity} predictedData={predictedData.humidity} showPrediction={true} />
                                </Suspense>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MachineLearning;