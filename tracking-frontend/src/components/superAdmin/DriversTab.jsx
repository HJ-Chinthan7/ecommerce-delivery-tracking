import React from "react";

const cardClass =
  "bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-white/20 transition-colors duration-300";
const listDividerClass = "divide-y divide-white/5";
const listItemClass =
  "py-4 flex items-center justify-between group hover:bg-white/[0.02] -mx-4 px-4 transition-colors";
const btnOutlineClass =
  "px-4 py-2 rounded-lg border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/10 transition-colors";

const DriversTab = ({
  pendingDrivers,
  approvedDrivers,
  handleApproveDriver,
}) => {
  return (
    <div className="py-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className={cardClass}>
        <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Pending Approval
        </h3>
        {pendingDrivers.length === 0 ? (
          <p className="text-zinc-500 text-sm italic">
            No drivers waiting for approval.
          </p>
        ) : (
          <ul className={listDividerClass}>
            {pendingDrivers.map((driver) => (
              <li key={driver._id} className={listItemClass}>
                <div>
                  <p className="text-sm font-medium text-white">
                    {" "}
                    {driver.name}
                  </p>
                </div>
                <button
                  onClick={() => handleApproveDriver(driver._id)}
                  className={btnOutlineClass}
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={cardClass}>
        <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-600" />
          Driver List
        </h3>
        {approvedDrivers.length === 0 ? (
          <p className="text-zinc-500 text-sm italic">
            No active drivers found.
          </p>
        ) : (
          <ul className={listDividerClass}>
            {approvedDrivers.map((driver) => (
              <li key={driver._id} className={listItemClass}>
                <div>
                  <p className="text-sm font-medium text-white">
                  <span className="text-sm font-bold text-purple-500">Name:</span>  {driver?.name}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] text-zinc-400 border border-white/10 px-1 rounded">
                      {driver?.regionId?.code || "No Region"}
                    </span>
                    {driver?.busId && (
                      <span className="text-[10px] text-green-500/80 border border-yellow-500/20 px-1 rounded">
                        Bus: {driver.busId.busId}
                      </span>
                    )}
                     {driver?.status && (
                      <span className="text-[10px] text-green-500/80 border border-red-500/20 px-1 rounded">
                        Status: {driver.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500">
                    {driver?.regionId?.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DriversTab;
