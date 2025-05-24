function Topbar({ dateRange, setDateRange, setRefresh, loading }) {

    const refreshing = () => {
        setRefresh(Math.random());
    }
    
    return(
        <div className="lg:ml-64 bg-white shadow-sm">
            <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 lg:space-x-4">
                    <h1 className="text-lg lg:text-xl font-semibold text-gray-800">Sensor Dashboard</h1>
                    <div className="hidden lg:block h-6 w-px bg-gray-200"></div>
                    <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="hidden lg:block px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2 lg:space-x-4">
                    <button 
                        onClick={refreshing}
                        className="inline-flex items-center px-2 lg:px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="hidden lg:inline ml-1.5">Refresh</span>
                    </button>
                    
                    <button 
                        onClick={()=>window.print()}
                        className="inline-flex items-center px-2 lg:px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="hidden lg:inline ml-1.5">Export Data</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Topbar;