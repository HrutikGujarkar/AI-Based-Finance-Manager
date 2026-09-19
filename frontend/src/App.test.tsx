// Simple test component to verify React is working
function TestApp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">React is Working!</h1>
        <p className="text-gray-600 mb-4">If you can see this, React and Vite are working correctly.</p>
        <div className="text-sm text-gray-500">
          <p>✅ React rendering</p>
          <p>✅ Tailwind CSS styling</p>
          <p>✅ Vite dev server</p>
        </div>
      </div>
    </div>
  );
}

export default TestApp;