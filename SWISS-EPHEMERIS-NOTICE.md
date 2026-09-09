# Swiss Ephemeris calculation source

This Kundli engine uses Swiss Ephemeris in the browser through a WebAssembly browser wrapper.

## Calculation source

- Engine: Swiss Ephemeris
- Sidereal mode: Lahiri, set inside Swiss Ephemeris
- Planet positions: geocentric, sidereal, with Swiss Ephemeris speed calculation
- Lunar node: Mean Node (Rahu); Ketu = Rahu + 180°
- House model used by this Vedic app: Whole Sign
- Official ephemeris files fetched at runtime, selected by birth year:
  - `sepl_18.se1` / `semo_18.se1` for 1800–2399 CE
  - `sepl_12.se1` / `semo_12.se1` for 1200–1799 CE
  - `sepl_06.se1` / `semo_06.se1` for 600–1199 CE
  - `sepl_00.se1` / `semo_00.se1` for 0–599 CE
- Official source repository: Astrodienst's Swiss Ephemeris repository
- Runtime browser package: `@swisseph/browser@1.3.1`

The application deliberately does **not** fall back to Astronomy Engine or a hand-written ayanamsha formula when Swiss Ephemeris fails. A failed ephemeris load is surfaced as an error rather than silently presenting a different calculation source.

## Important licensing note

Swiss Ephemeris is dual-licensed by Astrodienst. The open-source license has conditions (currently AGPL-3.0 in the published JS browser package); commercial/proprietary distribution may require a Swiss Ephemeris Professional License. Review the official Swiss Ephemeris license before public/commercial deployment.
