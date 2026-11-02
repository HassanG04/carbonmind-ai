# Hardware: Opt-In Adapters and Safe Fallback
**Non-negotiable:** hardware is NOT required for successful graduation demo or the scientific engine. No gas sensor, Raspberry Pi, smart-home controller, industrial PLC connection or additional purchased equipment is on the critical path.

## Level 0 — zero hardware (required)
Browser/photo uploads -> asset recognition; manual HP/specs/schedules; CSV/bill imports; timestamp and weather/daylight context; scientific energy estimates; Gemini explanations; simulated recommendations. Clearly label uncertainty and unverified states.

## Level 1 — one low-cost metering pilot (optional)
Use an appropriately certified smart plug or energy logger for one safe appliance, owner permission and electrical supervision. Send interval `timestamp, site, asset, watts, kwh, provenance` to secure API. Compare ML against measured reading. No exposed mains wiring improvisation.

## Level 2 — campus BMS / industrial telemetry (future)
Read-only building energy management, BACnet / Modbus adapter through sanctioned gateways, no controller credentials in web app. For factories, read-only OPC UA/SCADA integration only with facilities/OT approval and isolated network. Monitoring ≠ control.

## Level 3 — industrial methane/refrigerant (research extension)
Do not claim RGB webcam detects CH4. Detecting leaks needs proper instrument, calibration, background checks, dispersion models or source-specific mass-balance. Optional sensor estimates must distinguish concentration from leak-rate and direct emissions. If unavailable, use manual leak/recharge records with uncertainty.

## Optional smart-home expansion
An organizational campus office or dorm room can operate as a 'smart-home' pilot. Smart lights, AC automation and occupancy control are **optional consumer adapters**, not core enterprise scope. Initially issue advisory recommendations only. Automated shutoff must require explicit approval and adhere to safety/comfort constraints; never turn off critical loads.

## Fallback tests
- Disconnect optional meter -> user-input estimates continue and show reduced confidence.
- No camera permission -> manual inventory still works.
- No weather API -> use local schedule time plus 'weather unavailable' label, do not invent conditions.
- No Gemini API key -> standard dashboard and non-LLM calculations still work.
- No internet -> server can later sync data, with clear stale-data indication.
