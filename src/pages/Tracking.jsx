import { useEffect, useState, Suspense } from "react";
import GraphCard from "../components/GraphCard";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Topbar from "../components/Topbar";
import Map from "../components/Map";

function Tracking() {
    
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
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
    
    return (
        <div className="flex h-full bg-gray-100">
            <Sidebar />
            <div className="flex-1">
                {/* Top Navigation Bar */}
                <Topbar loading={loading} setRefresh={setRefresh} setDateRange={null} dateRange={null} />

                {/* Main Content */}
                <div className="lg:ml-64 p-4 lg:p-2">
                    <div className="grid grid-cols-1 ">
                        {loading ? (
                            // Show skeleton loading when data is being fetched
                            [...Array(1)].map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : (
                            
                            <>
                                <Suspense fallback={<SkeletonCard />}>
                                    <div className="w-full h-[500px]">
                                        <Map />
                                    </div>
                                </Suspense>
                            </>
                        )}
                    </div>
                    <footer className="mt-8 text-center text-sm text-gray-600 pb-4">
                        <p>&copy; {new Date().getFullYear()} AirQuality Dashboard. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default Tracking;