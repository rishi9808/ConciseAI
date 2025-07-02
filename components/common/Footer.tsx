import React from "react";

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">ConciseAI</h3>
            <span className="text-sm text-gray-500">AI-Powered Summaries</span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Support
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ConciseAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
