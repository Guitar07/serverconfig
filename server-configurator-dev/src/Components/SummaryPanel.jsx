import React from 'react';
import { ChevronLeft } from 'lucide-react';

const SummaryPanel = ({ 
  basePrice,
  formatPrice,
  calculateSubtotal,
  showDetails,
  setShowDetails,
  quantity,
  setQuantity,
  handleAddToCart,
  selectedOptions,
  chassisOptions,
  bezelOptions,
  tpmOptions,
  processors,
  memoryOptions,
  raidControllerOptions,
  bossControllerOptions,
  systemDrives,
  idracOptions,
  ocpOptions,
  pcieSlotOptions,
  powerSupplyOptions,
  rackmountKitOptions,
  windowsServerOptions,
  windowsCalOptions,
  warrantyOptions
}) => {
    return (
        <div className="md:col-span-1">
          <div className="sticky top-4">
            <div className="rounded-lg overflow-hidden bg-white shadow-lg">
              {/* Header */}
              <div className="bg-[#1881AE] p-4 text-white flex items-center gap-3">
                <ChevronLeft className="w-5 h-5" />
                <div className="flex items-center gap-2">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-6 h-6 fill-current"
                    aria-label="ServerSource Logo"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2zm0-4h10v2H7V7z" />
                  </svg>
                  <span className="font-semibold text-lg">ServerSource</span>
                </div>
              </div>

          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold text-[#1881AE]">Your System</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>{formatPrice(basePrice)}</span>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Selected Options:</span>
                  <span>{formatPrice(calculateSubtotal() - basePrice)}</span>
                </div>
                <div className="mt-1">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-[#1881AE] hover:underline text-sm"
                  >
                    {showDetails ? 'Hide details' : 'Show details'}
                  </button>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <label className="text-lg">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 p-2 border rounded-md text-center"
                />
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center">
                  <span className="text-green-600 font-medium">*Est Lead time: 5-7 days</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full py-3 rounded-md font-medium text-white bg-[#1881AE] hover:bg-[#157394] transition-colors duration-300"
              >
                Submit Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;