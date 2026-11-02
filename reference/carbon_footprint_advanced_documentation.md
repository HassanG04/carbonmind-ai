# Greenhouse Gases & Carbon Footprint — Advanced Technical Documentation

**Scope:** every major greenhouse gas, where it comes from, how it traps heat, how emissions from each source are *calculated* (equations, constants, worked examples), and how the numbers roll up into a footprint.
**Prepared:** 27 October 2026 · **Audience:** a technically-minded reader with no chemistry background (terms are explained the first time they appear).

---

## How to read this document

| Marker | Meaning |
| :--- | :--- |
| **✔ verified** (no mark) | Value or equation checked against a primary or institutional source during preparation (see §13 Verification log). |
| **†** | Standard reference value recalled from IPCC / peer-reviewed literature but **not re-fetched** during preparation. Fine for learning; confirm against the cited table before formal reporting. |
| **Plain-language box** | A "what this actually means" sentence after each equation. |

**Notation.** Gas formulas use subscripts: CO₂ (carbon dioxide), CH₄ (methane), N₂O (nitrous oxide). "Gt" = gigatonne = 10⁹ t. "Tg" = teragram = 10⁶ t = 1 million tonnes. "Pg" = petagram = 1 Gt. "ppm / ppb / ppt" = parts per million / billion / trillion by number of molecules in dry air. "W/m²" = watts per square metre of Earth's surface (a power density). Equations are written in LaTeX (`$...$`); view in a Markdown viewer with math support (GitHub, VS Code, Obsidian, Typora, Jupyter) for proper rendering.

---

## Table of contents

0. Your mental model, checked and corrected
1. The problem in one page: the Kaya identity
2. Physical foundations: how a gas traps heat
3. The gases, one by one (CO₂, CH₄, N₂O, F-gases, **ozone**, water vapour, aerosols)
4. Metrics: GWP, GTP, GWP\*, CO₂e
5. Calculating emissions from each source (equations): combustion, electricity, enteric fermentation, manure, rice, soils, fertiliser and chemicals, waste, fugitive fuels, industry, land use and fire, transport, natural sources
6. Methane sources in full (and N₂O, CO₂ budgets)
7. Footprint accounting: scopes, LCA, input-output
8. Reduction mathematics and policy mathematics
9. Impact equations
10. Uncertainty
11. Constants, conversions, common mistakes
12. Reference calculators (Python)
13. Verification log and references
14. Glossary

---

## 0. Your mental model, checked and corrected

You summarised the topic in your own words. Most of it is right, but three points need correcting and one needs sharpening. Getting these right matters because the rest of the document builds on them.

| # | What you said | Verdict | Precise version |
| :-: | :--- | :-: | :--- |
| 1 | "The more we use stuff, the more dangerous gases form." | ✅ Mostly right | Emissions = **activity × emissions per unit of activity**. More activity raises emissions; cleaner technology lowers emissions *per unit*. The two can be decoupled (see §1). "Stuff" means: burning fuel, farming (cattle, rice, fertiliser), making cement/steel/chemicals, rotting waste, and leaking refrigerants. |
| 2 | "The most dangerous gas is methane." | ⚠️ **Partly right — depends on the yardstick** | Per tonne emitted, methane is far more powerful *over short horizons* (≈80× CO₂ over 20 years). But the gas contributing the **most to warming so far is CO₂**, because we emit vastly more of it and it stays longer. See the three-yardstick table below. |
| 3 | "Methane comes from cattle burps, rotting things in landfills and other sources." | ✅ Right | Plus rice paddies, manure, wastewater, oil/gas leaks, coal mines, and *natural* sources (wetlands, termites, geological seeps). Full inventory in §6. |
| 4 | "CO₂ traps a small amount of heat for a **shorter** time … less than methane." | ❌ **Half wrong** | *Small amount per molecule* — **correct.** *Shorter time* — **incorrect, it is the reverse.** Methane lasts ~12 years; CO₂ has no single lifetime: roughly half a pulse is absorbed within decades, but **15–40 % stays for centuries to millennia** (§3.2). |
| 5 | "Too many small mistakes are worse than one big mistake." | ✅ **Exactly right** | This is the physics: total warming ≈ (heat per molecule) × (number of molecules) × (how long they stay). CO₂ is weak per molecule but ~220× more numerous than methane and persistent. The idea is formalised as *cumulative emissions → temperature* (§2.9). |
| 6 | "I think the ozone layer also adds to the greenhouse effect." | ⚠️ **Two different things are being mixed** | The **ozone layer** (stratosphere, ~15–35 km up) shields us from ultraviolet light; its *depletion* is a separate problem caused mainly by CFCs. **Ozone as a molecule (O₃)** *is* a greenhouse gas — and **ground-level (tropospheric) ozone does add warming** (+0.47 W/m², AR6). Chemicals that destroy the ozone layer are also often powerful greenhouse gases. Full treatment in §3.6. |

### The three yardsticks for "how dangerous is a gas?"

"Dangerous" has no single meaning. Scientists use three yardsticks, and each ranks the gases differently:

| Yardstick | CO₂ | CH₄ | N₂O | Winner |
| :--- | :--- | :--- | :--- | :--- |
| **A. Heat trapped per molecule** (radiative efficiency, W/m² per ppb)  ✔ | 1.37×10⁻⁵ | ≈3.6×10⁻⁴ (AR5) → ≈4.5×10⁻⁴ (Etminan 2016) | ≈3×10⁻³ | N₂O > CH₄ ≫ CO₂ |
| **B. Heat per tonne, integrated over a time horizon** (GWP) ✔ | 1 | 20-yr: **≈80–83**; 100-yr: **≈27–30** | 20-yr: 273; 100-yr: **273** | N₂O > CH₄ > CO₂ per tonne |
| **C. Total warming caused so far** (effective radiative forcing 1750→2019, W/m²) ✔ | **2.16** | **0.54** | **0.21** | **CO₂** (≈ 4× methane) |

Why do the rankings differ? Because yardstick C multiplies A by **abundance** and **persistence**:

- Today CO₂ ≈ 426 ppm (global mean 2025) while CH₄ ≈ 1.94 ppm (1,942 ppb in 2024) → CO₂ has **≈220× more molecules**.
- CO₂ stays far longer than methane, so each year's emissions *accumulate* instead of disappearing.
- Result: a weak-per-molecule gas can dominate total warming — your point #5.

Two further nuances that explain why methane still gets so much attention:

1. **Concentration-based vs emissions-based forcing.** The 0.54 W/m² above counts only methane's own direct effect on heat. When scientists attribute warming to *emissions* (including methane's side-effects — it makes ground-level ozone, adds stratospheric water vapour and its oxidation product is CO₂), methane's share rises to about **31 % (1.19 W/m² of 3.84 W/m²)** of the warming caused by emissions of greenhouse gases and their precursors (Saunois et al. 2025). Both numbers are correct; they answer different questions.
2. **Speed.** Because methane lasts only ~12 years, cutting methane emissions cools the planet *within a decade or two*, while cutting CO₂ only slows the *rate* of further warming. Methane is the fastest lever; CO₂ is the largest and most persistent driver.

> **Bottom line for your notes:** *CO₂ is the main long-term driver; methane is the strongest short-term lever and the second-largest driver; N₂O and fluorinated gases are smaller but extremely long-lived and potent per molecule.*

---

## 1. The problem in one page: the Kaya identity

Your first sentence ("the more we use stuff the more gases form") has an exact mathematical form called the **Kaya identity**. It splits CO₂ emissions into four multiplying factors:

$$
\underbrace{F}_{\text{CO}_2\text{ emitted}} \;=\; \underbrace{P}_{\text{population}} \times \underbrace{\frac{\text{GDP}}{P}}_{\text{wealth per person}} \times \underbrace{\frac{E}{\text{GDP}}}_{\text{energy per unit of wealth}} \times \underbrace{\frac{F}{E}}_{\text{CO}_2\text{ per unit of energy}}
$$

| Factor | Symbol | Unit | What lowers it |
| :--- | :--- | :--- | :--- |
| Population | $P$ | people | (slow, ethically constrained) |
| Affluence | GDP/$P$ | USD per person | (usually not a policy target) |
| Energy intensity | $E$/GDP | MJ per USD | efficiency: insulation, heat pumps, LEDs, better engines |
| **Carbon intensity of energy** | $F/E$ | kg CO₂ per MJ | switching from coal/oil/gas to wind, solar, hydro, nuclear |

**Worked example (illustrative numbers).** A country has $P$ = 50 million people, GDP/$P$ = 20,000 USD, $E$/GDP = 5 MJ/USD, and $F/E$ = 0.07 kg CO₂/MJ:

$$
F = 50\times10^{6}\times 20{,}000 \times 5 \times 0.07 = 3.5\times10^{11}\ \text{kg} = 350\ \text{Mt CO}_2
$$

If efficiency improves 20 % ($E$/GDP → 4) and the grid is cleaned by 30 % ($F/E$ → 0.049): $F = 50\times10^6\times20{,}000\times4\times0.049 = 196$ Mt, a 44 % cut *while the economy and population stay the same.* This is why "decoupling" growth from emissions is possible in principle.

**The same logic applies to every gas.** For methane and N₂O the "carbon intensity" factor is replaced by an emission factor per head of cattle, per hectare of rice, per tonne of waste, etc. — the subject of §5.

### Master accounting equation (used in every section below)

$$
\boxed{\;E_{\text{gas}} \;=\; \text{AD} \times \text{EF}\;}\qquad\qquad
\text{CO}_2\text{e} = \sum_{i} E_{i}\times \text{GWP}_{i}
$$

- **AD** = *activity data*: how much of something happened (litres of diesel burned, head of cattle, hectares of rice, tonnes of waste, kWh purchased).
- **EF** = *emission factor*: kg of gas emitted per unit of activity.
- **GWP** = *global warming potential*: the exchange rate converting each gas into CO₂-equivalent (§4).

Nothing is measured at the "tailpipe" of the whole planet; instead we count activities and multiply by factors that scientists derived from chemistry (combustion) or field measurements (cows, rice, soils). §5 explains where each factor comes from.

---

## 2. Physical foundations: how a gas traps heat

### 2.1 Earth's energy balance and the "natural" greenhouse effect

A hot object glows. The **Stefan–Boltzmann law** gives the power radiated per square metre by a perfect radiator ("black body") at temperature $T$ (in kelvin):

$$
j = \sigma T^{4}, \qquad \sigma = 5.670374\times10^{-8}\ \text{W m}^{-2}\text{K}^{-4}
$$

Earth in equilibrium radiates to space exactly as much energy as it absorbs from the Sun. Sunlight arrives on a disc of area $\pi R^2$ but is spread over a sphere of area $4\pi R^2$ (hence the factor ¼); about 30 % is reflected (albedo $\alpha\approx0.30$):

$$
\underbrace{\frac{S\,(1-\alpha)}{4}}_{\text{absorbed}} = \sigma T_e^{4}
\quad\Rightarrow\quad
T_e=\left[\frac{S(1-\alpha)}{4\sigma}\right]^{1/4}
$$

With the solar constant $S=1361$ W/m²: absorbed = **238.2 W/m²** and $T_e$ = **254.6 K = −18.6 °C**. The real average surface temperature is ≈ 288 K (+15 °C). The ≈ **33 K** gap is the *natural* greenhouse effect — without it, oceans would be frozen. It is caused mainly by water vapour and clouds, then CO₂, then O₃, N₂O, CH₄.

**Why does a gas layer warm the surface?** Sunlight is mostly visible light (peak wavelength ≈ 0.5 µm; Wien's law $\lambda_{max}=2898/T$ µm). It passes through the air and heats the ground. The ground (≈ 288 K) re-emits **infrared** heat with a peak near **10 µm**. Greenhouse gases absorb some of that infrared and re-emit it in all directions, including back down. Equivalent view used by climate scientists: *the atmosphere radiates to space from a certain height (≈ 5 km, the "effective emission level") where it is colder (≈ 255 K). Adding greenhouse gas raises that level; the new level is even colder; a colder emitter radiates less, so the planet temporarily gains energy and warms until the higher emission level is again at 255 K.* The surface warms by roughly (lapse rate ≈ 6.5 K/km) × (rise in emission height).

> Teaching toy model: one perfectly absorbing atmospheric layer gives $T_s = T_e\cdot2^{1/4}\approx 302.7$ K — too warm (reality ≈ 288 K) because the real atmosphere is not a perfect absorber and heat also moves by convection and evaporation. It shows the *mechanism*, not the number.

### 2.2 Why only some molecules are greenhouse gases

A molecule absorbs infrared only if one of its vibrations changes its **electric dipole** (a charge imbalance). That decides everything:

| Molecule | Shape | Absorbs infrared? | Key bands (µm) | Comment |
| :--- | :--- | :-: | :--- | :--- |
| N₂ (78 % of air), O₂ (21 %) | two identical atoms | ❌ no | – | Vibration never creates a dipole → invisible to infrared |
| **CO₂** | linear O=C=O | ✅ | **15** (bending), **4.3** (asymmetric stretch) | The symmetric stretch is inactive; bending at 15 µm sits at the peak of Earth's emission |
| **CH₄** | tetrahedral | ✅ | **7.7**, 3.3 | 7.7 µm lies on the edge of the "atmospheric window" |
| **N₂O** | linear N–N–O | ✅ | 17, 7.8, 4.5 | Overlaps with CH₄ near 7.8 µm (matters for the overlap terms in §2.6) |
| **H₂O** | bent | ✅ | rotational lines, 6.3 | Strongest natural greenhouse gas but controlled by temperature (feedback, not forcing) |
| **O₃** | bent | ✅ | **9.6** | Sits in the middle of the "window" |
| CFCs, HFCs, SF₆, NF₃ | many C–F, S–F bonds | ✅✅ | **8–12** | C–F / S–F bonds absorb strongly *inside* the atmospheric window |

**The atmospheric window** (≈ 8–13 µm) is the spectral gap where water vapour and CO₂ barely absorb, so Earth's heat escapes directly to space. A gas that absorbs *inside* the window plugs a hole, so each molecule is far more effective. This is why CH₄, N₂O, O₃ and especially F-gases are strong per molecule — and why CO₂, whose main band is already almost opaque at its centre, is comparatively weak per molecule.

### 2.3 Saturation: why the formulas are logarithmic, square-root or linear

Absorption follows the **Beer–Lambert law**: light passing through a gas column of path $L$ and absorber density $\rho$ is attenuated as

$$
I = I_0\, e^{-\kappa\,\rho L}
$$

($\kappa$ = absorption coefficient at that wavelength.) At the centre of a strong band (CO₂ at 15 µm) the air is already opaque, so adding gas cannot absorb more *there*; only the **wings** of the band, where absorption is weaker, still respond. The result depends on how strong the band is:

| Regime | Dependence of forcing on concentration | Gases | Why |
| :--- | :--- | :--- | :--- |
| **Weak band** (very dilute) | **Linear:** $\Delta F = \text{RE}\times\Delta c$ | CFCs, HFCs, SF₆, PFCs | Each new molecule adds the same absorption |
| **Intermediate** | **Square-root:** $\Delta F\propto\sqrt{c}-\sqrt{c_0}$ | CH₄, N₂O | Band centres are saturated, wings still open |
| **Strong band** | **Logarithmic:** $\Delta F\propto\ln(c/c_0)$ | CO₂ | Only band wings respond |

Consequence: every doubling of CO₂ adds the **same** forcing (≈ 3.7–3.9 W/m²), whether going 280→560 ppm or 560→1120 ppm — "diminishing returns per ppm, but each doubling still counts". It also means a **tonne of methane now is worth more than a tonne later** only in the sense that CH₄ forcing grows slower than linear, whereas F-gas forcing stays linear forever.

### 2.4 Definitions: RF, SARF, ERF, feedbacks, imbalance

| Term | Meaning |
| :--- | :--- |
| **Radiative forcing (RF)** | Change in net energy flux at the top of the atmosphere (W/m²) caused by a change in a driver, *before* the surface temperature responds. Positive = warming. |
| **SARF** (stratospheric-adjusted RF) | RF after the stratosphere (which responds within months) has re-equilibrated. The quantity computed by the simple formulas in §2.6. |
| **ERF** (effective radiative forcing) | SARF plus **rapid tropospheric adjustments** (clouds, water vapour, lapse rate changes that happen before surface warming). The IPCC AR6 headline measure. |
| **Feedback** | A response to *temperature change* that amplifies (positive) or damps (negative) warming: Planck, water vapour, lapse rate, surface albedo, clouds. |
| **Climate feedback parameter $\lambda$** | Net change in outgoing energy per kelvin of warming (W m⁻² K⁻¹); negative means stabilising. AR6's impulse-response scheme uses **λ = −1.31 W m⁻² K⁻¹** ✔. |
| **TOA imbalance $N$** | Net downward energy flux at the top of the atmosphere (≈ 0.9 W/m² today†); this is the planet's ongoing heat gain, mostly (~90 %) stored in the ocean. |

The planet's energy accounting in one line:

$$
N = F + \lambda\,\Delta T
$$

At equilibrium $N=0$, so **equilibrium warming** is $\Delta T_{eq} = -F/\lambda$.

### 2.5 Climate sensitivity

$$
\text{ECS}= \frac{F_{2\times}}{-\lambda},\qquad F_{2\times}\approx3.93\ \text{W/m}^2\ (\text{AR6 ERF}),\quad \lambda=-1.31\ \Rightarrow\ \text{ECS}\approx 3.0\ ^\circ\text{C}
$$

- **ECS** (equilibrium climate sensitivity) = long-run warming for a doubling of CO₂. AR6 best estimate **3 °C**, *likely* range 2.5–4 °C (as in the uploaded primer).
- **Without any feedback** (only the Planck response, $4\sigma T_e^3\approx3.74$ W m⁻² K⁻¹; AR6-era assessments use ≈ 3.2 W m⁻² K⁻¹ at the surface†): $\Delta T\approx 3.93/3.2\approx1.2$ °C. Water vapour, albedo and cloud feedbacks roughly *double and a half* this to ≈ 3 °C.
- **TCR** (transient climate response) = warming at the moment CO₂ has doubled when increased 1 %/yr; AR6 best estimate **1.8 °C** (likely 1.4–2.2 °C)†. TCR < ECS because the ocean delays full warming.

**Water vapour feedback (the biggest amplifier).** Warmer air holds more water vapour; the **Clausius–Clapeyron relation** gives the saturation vapour pressure change:

$$
\frac{1}{e_s}\frac{de_s}{dT}=\frac{L_v}{R_v T^2}\approx\frac{2.5\times10^{6}}{461.5\times288^{2}}\approx 0.065\ \text{K}^{-1}\ (\approx6.5\ \%\text{ per K})
$$

($L_v$ latent heat of vaporisation, $R_v$ gas constant of water vapour.) Water vapour is itself a greenhouse gas, so warming adds more vapour which adds more warming. It is a *feedback*, not a human emission, because vapour condenses out within ≈ 9 days, so its amount is set by temperature, not by us.

**One-box energy-balance model** (to see the delay between forcing and warming):

$$
C\frac{d(\Delta T)}{dt}=F(t)+\lambda\,\Delta T
\quad\Rightarrow\quad
\Delta T(t)=\frac{F}{-\lambda}\left(1-e^{-t/\tau}\right),\quad \tau=\frac{C}{-\lambda}
$$

$C$ = effective heat capacity per m² (mostly the ocean mixed layer), $\tau$ = response time (years to decades for the upper ocean; centuries for the deep ocean in two-layer versions). This is why warming continues for decades after emissions fall.

### 2.6 The forcing formulas for each gas

Three generations of "simple expressions" exist. All give the SARF (before adjustments) in W/m² from concentrations: $C$ in **ppm** (CO₂), $M$ in **ppb** (CH₄), $N$ in **ppb** (N₂O); subscript 0 = pre-industrial.

#### (a) Myhre et al. 1998 (the formula in most textbooks; used in IPCC TAR/AR4/AR5)

$$
\Delta F_{\text{CO}_2}=5.35\,\ln\!\left(\frac{C}{C_0}\right)
$$

Doubling: $5.35\ln2=$ **3.71 W/m²** ✔ (computed).

$$
\Delta F_{\text{CH}_4}=0.036\left(\sqrt{M}-\sqrt{M_0}\right)-\big[f(M,N_0)-f(M_0,N_0)\big]
$$
$$
\Delta F_{\text{N}_2\text{O}}=0.12\left(\sqrt{N}-\sqrt{N_0}\right)-\big[f(M_0,N)-f(M_0,N_0)\big]
$$
$$
f(M,N)=0.47\ln\!\Big[1+2.01\times10^{-5}(MN)^{0.75}+5.31\times10^{-15}M\,(MN)^{1.52}\Big]
$$

The $f$ term subtracts the **overlap** between CH₄ and N₂O bands near 7.8 µm (the same absorption cannot be counted twice).† (Coefficients as in Myhre et al. 1998 / IPCC TAR Table 6.2; recalled, not re-fetched.)

#### (b) Etminan et al. 2016 ✔ (verified against the paper)

Adds **shortwave** (incoming sunlight) absorption by CH₄ and N₂O and band overlap with CO₂. Overlap-dependent terms use mean concentrations $\bar C=\tfrac12(C+C_0)$, $\bar M=\tfrac12(M+M_0)$, $\bar N=\tfrac12(N+N_0)$:

$$
\Delta F_{\text{CO}_2}=\Big[a_1(C-C_0)^2+b_1|C-C_0|+c_1\bar N+5.36\Big]\ln\frac{C}{C_0}
$$
$$
\Delta F_{\text{N}_2\text{O}}=\Big[a_2\bar C+b_2\bar N+c_2\bar M+0.117\Big]\big(\sqrt{N}-\sqrt{N_0}\big)
$$
$$
\Delta F_{\text{CH}_4}=\Big[a_3\bar M+b_3\bar N+0.043\Big]\big(\sqrt{M}-\sqrt{M_0}\big)
$$

| Coefficient | Value | Unit |
| :-- | :-- | :-- |
| $a_1$ | $-2.4\times10^{-7}$ | W m⁻² ppm⁻² |
| $b_1$ | $7.2\times10^{-4}$ | W m⁻² ppm⁻¹ |
| $c_1$ | $-2.1\times10^{-4}$ | W m⁻² ppb⁻¹ |
| $a_2$ | $-8.0\times10^{-6}$ | W m⁻² ppm⁻¹ |
| $b_2$ | $4.2\times10^{-6}$ | W m⁻² ppb⁻¹ |
| $c_2$ | $-4.9\times10^{-6}$ | W m⁻² ppb⁻¹ |
| $a_3$ | $-1.3\times10^{-6}$ | W m⁻² ppb⁻¹ |
| $b_3$ | $-8.2\times10^{-6}$ | W m⁻² ppb⁻¹ |

Valid for CO₂ 180–2000 ppm, N₂O 200–525 ppb, CH₄ 340–3500 ppb. Headline results ✔: methane's 1750–2011 forcing rises from 0.48 to **0.61 W/m²** (≈ +25 %); CO₂ (1.83 W/m²) and N₂O (0.17 W/m²) are essentially unchanged; methane's radiative efficiency rises from 3.63×10⁻⁴ to **4.48×10⁻⁴ W m⁻² ppb⁻¹**; its GWP-100 rises from 28 to **32**. At 2000 ppm CO₂ the new formula gives ≈ 10 % more forcing than the simple log law. Re-running the formula with 1750–2011 concentrations reproduces these figures (computed: CO₂ 1.83, CH₄ 0.61, N₂O 0.17 W/m²).

#### (c) Meinshausen et al. 2020 — used in IPCC AR6 ✔

Same structure with square-root dependence in the coefficients and a quadratic saturation correction for CO₂. Baseline: $C_0=278.3$ ppm, $M_0=729.2$ ppb, $N_0=270.1$ ppb (1750).

$$
\text{SARF}_{\text{CO}_2}=\big(\alpha'+\alpha_{N_2O}\big)\ln\frac{C}{C_0},\qquad
\alpha'=d_1+a_1(C-C_0)^2+b_1(C-C_0),\qquad
\alpha_{N_2O}=c_1\sqrt{N}
$$
$$
\text{SARF}_{\text{CH}_4}=\big(a_3\sqrt{M}+b_3\sqrt{N}+d_3\big)\big(\sqrt{M}-\sqrt{M_0}\big)
$$
$$
\text{SARF}_{\text{N}_2\text{O}}=\big(a_2\sqrt{C}+b_2\sqrt{N}+c_2\sqrt{M}+d_2\big)\big(\sqrt{N}-\sqrt{N_0}\big)
$$

| CO₂ | CH₄ | N₂O |
| :-- | :-- | :-- |
| $a_1=-2.4785\times10^{-7}$ | $a_3=-8.9603\times10^{-5}$ | $a_2=-3.4197\times10^{-4}$ |
| $b_1=7.5906\times10^{-4}$ | $b_3=-1.2462\times10^{-4}$ | $b_2=2.5455\times10^{-4}$ |
| $c_1=-2.1492\times10^{-3}$ | $d_3=0.045194$ | $c_2=-2.4357\times10^{-4}$ |
| $d_1=5.2488$ | | $d_2=0.12173$ |

(For $C$ above the maximum of the quadratic, $\alpha'$ is held constant at its peak value.) **Reproduction check (computed):**

| Year | CO₂ SARF → ERF | CH₄ SARF → ERF | N₂O SARF → ERF |
| :-- | :-- | :-- | :-- |
| 2019 (409.9 ppm, 1866 ppb, 332.1 ppb) | 2.05 → **2.16** | 0.63 → **0.54** | 0.195 → **0.21** |
| 2024 (423.9 ppm, 1942 ppb, 338.0 ppb; WMO) | 2.24 → **2.35** | 0.67 → **0.57** | 0.21 → **0.23** |
| 2×CO₂ (556.6 ppm) | **3.75 SARF → 3.93 ERF** | | |

The ERF column multiplies by a tropospheric-adjustment factor (**≈ +5 % CO₂, ≈ −14 % CH₄, ≈ +7 % N₂O**†) — the factors are inferred from matching AR6's published ERFs (2.16, 0.54, 0.21 W/m²), not quoted from a table; check AR6 Chapter 7 for the official values. Note methane's *negative* adjustment: methane absorbs solar near-infrared in the troposphere, which suppresses some cloud formation.

#### (d) Halogenated and other well-mixed gases (linear)

$$
\Delta F_{X}=\text{RE}_X\times\big(c_X-c_{X,0}\big)
$$

RE in W m⁻² ppb⁻¹ (or ppt⁻¹). Pre-industrial concentrations of synthetic gases are zero. Example: CFC-12 at ~500 ppt × RE ≈ 0.32 W m⁻² ppb⁻¹† = 0.16 W/m². All halogenated gases together add **0.41 W/m²** ✔ (AR6).

#### Anthropogenic forcing, AR6, 1750→2019 ✔ (W/m², best estimate [very likely range])

| Component | ERF | Comment |
| :-- | :-: | :-- |
| CO₂ | **2.16** [1.90–2.41] | largest single driver |
| CH₄ | **0.54** [0.43–0.65] | second |
| N₂O | **0.21** [0.18–0.24] | |
| Halogenated gases (CFCs, HCFCs, HFCs, PFCs, SF₆, NF₃…) | **0.41** [0.33–0.49] | mostly CFCs (now declining) and growing HFCs |
| Ozone (O₃) | **0.47** [0.24–0.71] | tropospheric ozone is the positive part (§3.6) |
| Aerosols (cooling) | **−1.3** [−2.0 to −0.6] | masks warming; falling as air pollution is cleaned |
| **Total anthropogenic** | **2.72** [1.96–3.48] | (net of aerosol cooling and other minor terms, contrails, land-use albedo, etc.) |

Concentrations ✔: **1750** — CO₂ 278 ppm, CH₄ 722–729 ppb, N₂O 270 ppb; **2019** — CO₂ 409.9 ppm, CH₄ 1866 ppb, N₂O 332.1 ppb; **2024 (WMO)** — CO₂ 423.9 ppm, CH₄ 1942 ppb, N₂O 338.0 ppb; **2025 global mean** CO₂ ≈ 426 ppm; **Mauna Loa June 2026** 431.4 ppm (seasonal high is around May).

### 2.7 Carbon budget: how cumulative CO₂ becomes temperature

Because CO₂ persists, warming tracks **cumulative** emissions. The slope is the **TCRE** (transient climate response to cumulative emissions):

$$
\Delta T\;\approx\;\text{TCRE}\times\sum E_{\text{CO}_2},\qquad \text{TCRE}\approx0.45\ ^\circ\text{C per 1000 GtCO}_2\ \ (\text{likely }0.27\text{–}0.63)\ \dagger
$$

Remaining budget for 1.5 °C (human-induced warming ≈ 1.37 °C in 2025): **≈ 130 GtCO₂ from the start of 2026 for a 50 % chance** ✔ (Indicators of Global Climate Change 2025). At today's ≈ **42 GtCO₂ per year** (fossil + land use) ✔ that is about **3 years** of emissions:

$$
\text{years left}\approx\frac{130}{42}\approx3.1
$$

The budget shrinks by one year of emissions each year. (For comparison AR6 gave ≈ 500 GtCO₂ from early 2020†; the difference is ≈ 5 years of emissions plus updated warming estimates.) Human-induced warming is currently rising ≈ 0.27 °C per decade ✔.

---

## 3. The gases, one by one

### 3.1 Master comparison table

| Gas | Formula | 1750 | 2019 ✔ | 2024 ✔ | Atmospheric lifetime | Radiative efficiency (W m⁻² ppb⁻¹) | GWP-20 | GWP-100 | GWP-500 | ERF 1750→2019 (W/m²) ✔ |
| :-- | :-: | :-: | :-: | :-: | :-- | :-- | :-: | :-: | :-: | :-: |
| Carbon dioxide | CO₂ | 278 ppm | 409.9 ppm | 423.9 ppm | **no single value** (multi-timescale, §3.2) | 1.37×10⁻⁵ (AR5) | 1 | 1 | 1 | **2.16** |
| Methane (fossil) | CH₄ | 722–729 ppb | 1866 ppb | 1942 ppb | **11.8 ± 1.8 yr** (AR6 perturbation lifetime) | 3.63×10⁻⁴ (AR5); 4.48×10⁻⁴ (Etminan 2016) | **82.5** | **29.8** | ≈10† | **0.54** |
| Methane (non-fossil/biogenic) | CH₄ | – | – | – | same | same | **79.7–81** | **27.0** | ≈7.3† | (in the 0.54) |
| Nitrous oxide | N₂O | 270 ppb | 332.1 ppb | 338.0 ppb | ≈ **109 yr**† | ≈3.0×10⁻³† | **273** | **273** | ≈130† | **0.21** |
| HFC-134a | CH₂FCF₃ | 0 | – | – | ≈14 yr† | ≈1.6×10⁻¹† | – | **1,526** | – | (halogenated total **0.41**) |
| HFC-32 | CH₂F₂ | 0 | – | – | ≈5 yr† | – | – | **771** | – | |
| HFC-125 | CHF₂CF₃ | 0 | – | – | ≈30 yr† | – | – | **3,740** | – | |
| CF₄ (PFC-14) | CF₄ | ≈35 ppt | – | – | **≈50,000 yr**† | – | – | **7,380** | – | |
| C₂F₆ (PFC-116) | C₂F₆ | 0 | – | – | ≈10,000 yr† | – | – | **12,400** | – | |
| Sulphur hexafluoride | SF₆ | 0 | – | – | **≈3,200 yr**† | ≈0.57† | – | **25,200** | – | |
| Nitrogen trifluoride | NF₃ | 0 | – | – | ≈500–570 yr† | – | – | **17,400** | – | |
| CFC-12 | CCl₂F₂ | 0 | – | – | ≈100 yr† | ≈0.32† | – | ≈10,200† | – | (declining under Montreal Protocol) |
| Ozone | O₃ | – | – | – | days–weeks (troposphere)† | – | – | not assigned (not emitted) | – | **0.47** (total ozone) |

Notes on the table:

- GWP-100 values for CH₄ differ by *which table* is used: AR6 Table 7.15 gives **27.0** (non-fossil) and **29.8** (fossil); some compilations quote **27.9** (supplementary table) or **28** (AR5 without climate-carbon feedback) or **34** (AR5 with feedback) or **32** (AR5 + Etminan 2016). *Always state which assessment report and whether the gas is fossil or biogenic.* AR6 distinguishes fossil from non-fossil methane because fossil methane oxidises to *new* CO₂ (carbon taken from underground), whereas biogenic methane's carbon was recently in the atmosphere.
- GWP-20 for CH₄ from the Global Methane Budget: **82.5** (fossil), **79.7** (microbial) ✔; other tabulations list ≈ 80.8–81.2 for non-fossil.
- Synthetic gases (HFCs, PFCs, SF₆, NF₃, CFCs) have **zero** pre-industrial concentration — every molecule is human-made.
- Lifetimes marked † are standard assessment values recalled, not re-fetched.

### 3.2 Carbon dioxide (CO₂) in depth

**What it is.** One carbon atom bonded to two oxygen atoms. Produced whenever carbon-containing material is burned or respired.

**Why CO₂ has no single "lifetime".** Methane is chemically *destroyed* (by hydroxyl radicals). CO₂ is never destroyed; it is **moved between reservoirs** — atmosphere ↔ ocean ↔ vegetation ↔ soils ↔ sediments — at very different speeds. After a pulse of CO₂ is released, the fraction still in the air follows a **sum of exponentials** (the Joos et al. impulse-response function used in IPCC AR5 ✔, reproduced numerically):

$$
\text{IRF}_{\text{CO}_2}(t)= a_0+\sum_{i=1}^{3}a_i\,e^{-t/\tau_i},\qquad
\begin{array}{l}a_0=0.2173,\ a_1=0.2240,\ a_2=0.2824,\ a_3=0.2763\\[2pt]\tau_1=394.4\text{ yr},\ \tau_2=36.54\text{ yr},\ \tau_3=4.304\text{ yr}\end{array}
$$

($a_0+a_1+a_2+a_3=1$.) The term $a_0$ never decays on human timescales — it is the part removed only by slow geological weathering (tens to hundreds of thousands of years). Evaluating the formula ✔ (computed):

| Years after emission | 1 | 5 | 10 | 20 | 50 | 100 | 200 | 500 | 1,000 | 10,000 |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **Fraction of CO₂ still airborne** | 93.5 % | 77.1 % | 67.8 % | 59.6 % | 48.7 % | **40.9 %** | 35.3 % | 28.0 % | **23.5 %** | 21.7 % |

> **Answer to "how long does CO₂ trap heat?"** — About **two-thirds is still there after 10 years, 41 % after a century, and ≈ 22–24 % after a millennium** (the wider literature gives 15–40 % depending on model and emission size†). Compare methane below: only **≈ 4 %** of a methane pulse remains after 36 years.

**Sources (human):** fossil-fuel combustion (≈ 37–38 GtCO₂/yr†), land-use change/deforestation (≈ 4 GtCO₂/yr†), and chemistry of cement and some industries (§5.11); together ≈ **42 GtCO₂/yr** ✔ (IGCC 2025).

**Sinks (what stops it all staying airborne):** ocean uptake (≈ 25–30 %), land vegetation and soils (≈ 30 %) and an **airborne fraction** of ≈ 44–46 %† remaining in the atmosphere. This is the budget identity:

$$
E_{\text{FOS}}+E_{\text{LUC}} \;=\; G_{\text{ATM}}+S_{\text{OCEAN}}+S_{\text{LAND}}+B_{\text{IM}}
\qquad\text{(Global Carbon Budget)}
$$

$B_{IM}$ = budget imbalance (measurement error). Conversion used throughout: **1 ppm CO₂ = 2.134 GtC = 7.82 GtCO₂** ✔ (computed from the atmosphere's mass, 5.148×10¹⁸ kg). Atmospheric carbon today ≈ 2.134 × 426 ≈ **909 GtC**.

**Ocean acidification — the "other CO₂ problem".** Dissolved CO₂ forms carbonic acid:

$$
\text{CO}_2+\text{H}_2\text{O}\rightleftharpoons\text{H}_2\text{CO}_3\rightleftharpoons\text{H}^{+}+\text{HCO}_3^{-}\rightleftharpoons2\text{H}^{+}+\text{CO}_3^{2-}
$$

More CO₂ → more H⁺ (lower pH) and fewer carbonate ions $\text{CO}_3^{2-}$, which shell-building organisms need. Details in §9.

### 3.3 Methane (CH₄) in depth

**What it is.** One carbon atom bonded to four hydrogen atoms; the main component of natural gas; also called "marsh gas".

**How it forms in nature and in cattle — methanogenesis.** In oxygen-free (anaerobic) environments, microbes called **methanogenic archaea** (not bacteria) convert carbon compounds to methane. The three main pathways:

$$
\begin{aligned}
&\text{Hydrogenotrophic:}&& \text{CO}_2+4\,\text{H}_2\;\longrightarrow\;\text{CH}_4+2\,\text{H}_2\text{O}\\
&\text{Acetoclastic (acetate-splitting):}&& \text{CH}_3\text{COOH}\;\longrightarrow\;\text{CH}_4+\text{CO}_2\\
&\text{Methylotrophic:}&& \text{CH}_3\text{OH}+\text{H}_2\;\longrightarrow\;\text{CH}_4+\text{H}_2\text{O}
\end{aligned}
$$

Where this happens: the **rumen** of cattle, sheep, goats and buffalo (hydrogenotrophic dominates), flooded **rice soils**, **wetlands** and lake sediments, **manure** stored without oxygen, **landfills** (acetate and H₂ routes), **wastewater sludge**, **termite guts**, and ocean-floor sediments/permafrost (as "clathrates"/hydrates).

**How it leaves the atmosphere (sinks).** ≈ 90 % is destroyed by the **hydroxyl radical (OH)**, the atmosphere's "detergent":

$$
\text{CH}_4+\text{OH}\rightarrow\text{CH}_3+\text{H}_2\text{O},\qquad
\text{CH}_3+\text{O}_2+M\rightarrow\text{CH}_3\text{O}_2,\ \ldots\ \rightarrow\text{HCHO}\rightarrow\text{CO}\rightarrow\text{CO}_2
$$

Tropospheric chemical loss ≈ **563 Tg CH₄/yr** ✔ (Global Methane Budget); soils (methanotrophic bacteria) take up ≈ 30–40 Tg/yr† and the stratosphere (reaction with O(¹D), Cl) a small remainder. Note the end product: **methane oxidises to CO₂**, so each CH₄ eventually adds CO₂ (this is the "extra CO₂" counted in AR6's *fossil* methane GWP).

**Lifetime arithmetic.** For a gas with total burden $B$ (mass in the atmosphere) and total sink rate $S$:

$$
\tau_{\text{global}}=\frac{B}{S}\quad(\approx 9.1\ \text{yr for CH}_4\ ✔\text{AR5})
$$

But methane has a **feedback on its own lifetime**: adding CH₄ uses up OH, so the sink weakens and methane survives longer. The lifetime of a *perturbation* is therefore longer: $\tau_{\text{pert}}=f\times\tau_{\text{global}}$ with feedback factor $f\approx1.3$ → AR5 **12.4 yr** (AR6 **11.8 ± 1.8 yr**). The **perturbation lifetime** is what enters GWP.

**Decay of a methane pulse** (single exponential, $e^{-t/\tau}$ with τ = 11.8 yr ✔ computed):

| Years after emission | 1 | 5 | 10 | 12 | 20 | 36 | 50 | 100 |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **Fraction of CH₄ pulse remaining** | 91.9 % | 65.5 % | 42.9 % | 36.2 % | 18.4 % | 4.7 % | 1.4 % | ≈ 0 |

**Methane's three side effects (why its GWP is larger than its direct effect):** (1) produces **tropospheric ozone** (§3.6); (2) produces **stratospheric water vapour** (CH₄ oxidation in the stratosphere releases H₂O, a greenhouse gas); (3) produces **CO₂**. AR5's "indirect-effect enhancement" for methane's AGWP was ≈ +65 %. These are why the *emissions-based* methane forcing (1.19 W/m² ✔) is more than twice the *concentration-based* one (0.54 W/m² ✔).

**Concentration history.** 722–729 ppb (1750) → 1866 (2019) → 1942 ppb (2024) ✔, i.e. ≈ **2.7× pre-industrial**. Growth ≈ 10 ppb/yr recently†. A 2020 surge was partly due to wetlands and a slowdown in OH.

### 3.4 Nitrous oxide (N₂O) in depth

**What it is.** Two nitrogen atoms and one oxygen atom; "laughing gas".

**Where it comes from.** Microbes in soils and water make it as a by-product of two nitrogen-cycle processes (full chemistry in §5.7):

$$
\textbf{Nitrification: }\ \text{NH}_4^{+}\rightarrow\text{NH}_2\text{OH}\rightarrow\text{NO}_2^{-}\rightarrow\text{NO}_3^{-}\ (\text{N}_2\text{O leaks out})
$$
$$
\textbf{Denitrification: }\ \text{NO}_3^{-}\rightarrow\text{NO}_2^{-}\rightarrow\text{NO}\rightarrow\textbf{N}_2\textbf{O}\rightarrow\text{N}_2
$$

Adding nitrogen fertiliser, manure, or crop residues gives microbes more fuel, so more N₂O leaks. Industrial sources: **nitric acid** and **adipic acid** (nylon) plants, combustion (small), biomass burning, wastewater treatment, aquaculture.

**Why it matters.** (i) **Long-lived:** ≈ 109 yr† (≈ 63 % of a pulse remains after 50 yr, 37 % after 109 yr, 16 % after 200 yr ✔ computed); (ii) **potent:** GWP-100 = **273** ✔; (iii) **rising:** ≈ 24 % above its pre-industrial 270 ppb and growing ≈ 1 ppb/yr ✔ (NOAA); (iv) **ozone destroyer:** N₂O is now the largest *emitted* ozone-depleting substance (Ravishankara et al. 2009†), because in the stratosphere it reacts with excited oxygen atoms: $\text{N}_2\text{O}+\text{O}(^1\text{D})\rightarrow2\,\text{NO}$, and NO catalytically destroys O₃ (§3.6).

**Budget magnitude.** Total ≈ 17 Tg N/yr (≈ 27 Tg N₂O/yr), about **40 % human-caused**†, agriculture (synthetic fertiliser + manure applied/deposited on soil) being the dominant human source†.

### 3.5 Fluorinated gases and ozone-depleting substances

| Family | Examples | Use | Why dangerous | Policy |
| :-- | :-- | :-- | :-- | :-- |
| **CFCs** | CFC-11, -12, -113 | old fridges, aerosols, foam blowing | Destroy ozone *and* GWP-100 ≈ 4,000–10,000† | Phased out by Montreal Protocol (1987) |
| **HCFCs** | HCFC-22 | transitional refrigerants | Weaker ozone destroyers, GWP-100 ≈ 1,800–2,000† | Being phased out |
| **Halons** | Halon-1301 | fire extinguishers | Bromine destroys ozone ≈ 60× more effectively than chlorine per atom† | Phased out |
| **HFCs** | HFC-134a (car A/C), HFC-32, R-410A blend | modern A/C, fridges | **No ozone damage** but GWP-100 ≈ 100–15,000 | **Kigali Amendment** (2016; in force 2019) phases down |
| **PFCs** | CF₄, C₂F₆ | aluminium smelting by-product, semiconductor etch | Lifetimes 10,000–50,000 yr: effectively permanent | Reporting / abatement |
| **SF₆** | – | electrical switchgear insulation | Most potent GWP: **25,200**; lifetime ≈ 3,200 yr† | Replace with alternatives |
| **NF₃** | – | chip/solar-cell cleaning | GWP **17,400** | Abatement |

**Blends:** GWP of a mixture is the mass-weighted average, e.g. R-410A = 50 % HFC-32 + 50 % HFC-125:
$\text{GWP}=0.5\times771+0.5\times3{,}740=\mathbf{2{,}255}$ ✔ (computed). Leaking 1 kg of R-410A = 2.26 tonnes CO₂e.

**Why F-gases are linear in forcing and so potent:** they are extremely dilute (parts per *trillion*), their C–F/S–F bonds absorb exactly in the atmospheric window, and they are not saturated — so $\Delta F=\text{RE}\times\Delta c$ holds exactly (§2.3).

### 3.6 Ozone (O₃) — the full picture (you asked specifically)

Ozone is one molecule with two roles depending on **where** it sits. The word "ozone layer" mixes them up — hence your question.

| | **Stratospheric ozone ("good", the ozone layer)** | **Tropospheric ozone ("bad", smog)** |
| :-- | :-- | :-- |
| Altitude | ≈ 15–35 km, peak ≈ 20–25 km | surface to ≈ 10–15 km |
| Share of all ozone | ≈ 90 % | ≈ 10 % |
| Origin | Natural, formed by sunlight acting on O₂ | **Not emitted** — formed from pollutants + sunlight |
| Function | Absorbs harmful ultraviolet (UV-B/UV-C) | Lung irritant, damages crops and plants |
| Human threat | **Depletion** (CFCs, halons, N₂O) | **Increase** (NOₓ, CH₄, CO, VOCs) |
| Effect on climate | Depletion → slight **cooling** (small negative forcing, order −0.02 to −0.05 W/m²†) | Increase → **warming** (+0.47 W/m² total ozone ERF ✔) |
| Lifetime | months–years | **days–weeks**† |

**So, to answer you directly:** the *ozone layer itself* is not a major cause of the greenhouse effect, and its depletion is **not** the cause of global warming (a common misconception). But **(i)** ozone (O₃) is a genuine greenhouse gas, absorbing infrared at 9.6 µm — right in the middle of the atmospheric window; **(ii)** *ground-level* ozone, which we create indirectly by burning fuel and releasing methane, **adds about 0.47 W/m²** of warming; and **(iii)** the chemicals that destroyed the ozone layer (CFCs, halons) are themselves extremely potent greenhouse gases, so the Montreal Protocol — designed to save the ozone layer — avoided far more warming than any climate treaty so far†.

#### Stratospheric ozone: formation and destruction

**Chapman cycle (1930)** — natural production and loss:

$$
\begin{aligned}
&\text{O}_2+h\nu\ (\lambda<242\text{ nm})\rightarrow2\,\text{O}\\
&\text{O}+\text{O}_2+M\rightarrow\text{O}_3+M\qquad(\text{ozone formation; }M=\text{N}_2\text{ or O}_2\text{ carries off excess energy})\\
&\text{O}_3+h\nu\ (\lambda\lesssim310\text{ nm})\rightarrow\text{O}_2+\text{O}\qquad(\text{absorbs UV and heats the stratosphere})\\
&\text{O}+\text{O}_3\rightarrow2\,\text{O}_2
\end{aligned}
$$

Absorbing UV is *why* the stratosphere gets warmer with height (a temperature inversion), which is what keeps the layers stable.

**Catalytic destruction** — a "catalyst" X (chlorine Cl, bromine Br, nitric oxide NO, hydroxyl OH) is not used up, so one atom destroys many ozone molecules:

$$
\begin{aligned}
&\text{X}+\text{O}_3\rightarrow\text{XO}+\text{O}_2\\
&\text{XO}+\text{O}\rightarrow\text{X}+\text{O}_2\\
&\hline
&\text{Net: }\ \text{O}_3+\text{O}\rightarrow2\,\text{O}_2
\end{aligned}
$$

One chlorine atom can destroy on the order of **10⁵ ozone molecules** before being removed†.

**Where the chlorine comes from.** CFCs are inert near the ground, drift up, and are split by short-wave UV:

$$
\text{CF}_2\text{Cl}_2+h\nu\rightarrow\text{CF}_2\text{Cl}+\text{Cl}
$$

**The Antarctic ozone hole.** In polar winter, **polar stratospheric clouds** provide surfaces for reactions that convert "reservoir" chlorine into active chlorine; when spring sunlight returns:

$$
\text{ClONO}_2+\text{HCl}\xrightarrow{\ \text{PSC}\ }\text{Cl}_2+\text{HNO}_3,\qquad
\text{Cl}_2+h\nu\rightarrow2\,\text{Cl}
$$
$$
\text{ClO}+\text{ClO}+M\rightarrow\text{Cl}_2\text{O}_2,\qquad \text{Cl}_2\text{O}_2+h\nu\rightarrow\text{Cl}+\text{ClOO},\qquad \text{ClOO}\rightarrow\text{Cl}+\text{O}_2
$$
$$
\text{Net: }\ 2\,\text{O}_3\rightarrow3\,\text{O}_2
$$

**Measurement unit.** The **Dobson unit (DU)**: 1 DU = a 0.01 mm layer of pure ozone at 0 °C and 1 atm = 2.687×10¹⁶ molecules/cm². Global mean ≈ 300 DU; the "hole" is defined as < 220 DU.

**Policy and recovery.** Montreal Protocol (agreed 1987) phased out CFCs, halons, CCl₄, HCFCs. Recovery is expected around 2040 (global), 2045 (Arctic), 2066 (Antarctic) per the WMO/UNEP 2022 assessment†. **Kigali Amendment** (2016) phases down HFCs (no ozone damage, high GWP). Two-way link to climate: rising CO₂ *cools* the stratosphere, which slows some ozone loss; N₂O and CH₄ changes alter ozone chemistry.

#### Tropospheric ozone: formation

It is a **secondary pollutant**: made from sunlight acting on nitrogen oxides (NOₓ = NO + NO₂) in the presence of hydrocarbons:

$$
\begin{aligned}
&\text{NO}_2+h\nu\ (\lambda<400\text{ nm})\rightarrow\text{NO}+\text{O}\\
&\text{O}+\text{O}_2+M\rightarrow\text{O}_3+M\\
&\text{NO}+\text{O}_3\rightarrow\text{NO}_2+\text{O}_2\qquad(\text{this "null cycle" just recycles the ozone})
\end{aligned}
$$

On its own the cycle makes no net ozone. **Net production** happens when peroxy radicals (from CH₄, CO and volatile organic compounds) convert NO to NO₂ *without* using up an O₃:

$$
\text{HO}_2+\text{NO}\rightarrow\text{OH}+\text{NO}_2,\qquad \text{RO}_2+\text{NO}\rightarrow\text{RO}+\text{NO}_2
$$

For methane, with NOₓ acting as a catalyst, the idealised overall result is ✔ (atom-balanced):

$$
\text{CH}_4+8\,\text{O}_2\;\xrightarrow{\ \text{NO}_x,\ h\nu\ }\;\text{CO}_2+2\,\text{H}_2\text{O}+4\,\text{O}_3
$$

— up to four ozone molecules per methane in the ideal case (real yields are lower†). **Precursors:** NOₓ (vehicles, power plants), CH₄ (long-lived "background" precursor), CO, and non-methane volatile organic compounds (solvents, fuel vapours, plant emissions like isoprene). Because tropospheric ozone lasts only days–weeks, its warming is **regionally patchy** and tracks emissions closely — it is a *short-lived climate forcer*, like methane.

**Extra harms:** damages lung tissue; reduces crop yields; damages plants, which then **absorb less CO₂** — an indirect warming effect.

### 3.7 Water vapour, clouds, aerosols and contrails (not "gases we emit", but they matter)

| Agent | Role | Sign | Comment |
| :-- | :-- | :-: | :-- |
| **Water vapour (H₂O)** | Strongest greenhouse gas by absorption | feedback + | Controlled by temperature (≈ 6.5 %/K, §2.5); ~9-day residence time; **not** a human "emission" for accounting purposes. Small direct sources (irrigation, power plant cooling) are negligible globally. |
| **Stratospheric water vapour** | Produced from CH₄ oxidation | + | Part of methane's indirect effect. |
| **Clouds** | Reflect sunlight (cool) and trap heat (warm) | ± | Largest uncertainty in climate sensitivity. |
| **Sulphate aerosols** (from SO₂ in coal/ship fuel) | Reflect sunlight; brighten clouds | **−** | Aerosol ERF **−1.3 W/m²** ✔ — a large cooling that *masks* warming. Cleaning air (coal scrubbers, shipping fuel rules) removes this cooling, causing a small "termination shock" warming. |
| **Black carbon (soot)** | Absorbs sunlight; darkens snow and ice | **+** | Short-lived (days–weeks); from incomplete combustion, wildfire, diesel engines, cookstoves. Not a gas but a short-lived climate forcer, grouped with CH₄ and O₃. |
| **Contrails / contrail cirrus** | Ice clouds from aircraft trap outgoing heat | + | The largest single component of aviation's climate effect (≈ 57 mW/m²; total aviation ERF ≈ 100 mW/m², about 3× its CO₂-only effect — Lee et al. 2021†). |

### 3.8 Indirect greenhouse-gas precursors

These gases are not strong absorbers themselves, but they change the chemistry of those that are:

| Gas | Source | Climate effect |
| :-- | :-- | :-- |
| **CO** (carbon monoxide) | Incomplete combustion, wildfires | Consumes OH → lengthens CH₄ lifetime; helps make O₃; oxidises to CO₂ → net warming |
| **NOₓ** (NO + NO₂) | High-temperature combustion, lightning, soils | Makes O₃ (warming) but also boosts OH, shortening CH₄ life (cooling) → small/uncertain net, depends on location |
| **NMVOCs** (non-methane volatile organic compounds) | Solvents, fuel evaporation, vegetation | Make O₃, extend CH₄ lifetime |
| **SO₂** | Coal, smelters, shipping | Becomes sulphate aerosol → cooling |

### 3.9 A tale of two bathtubs — why "many small mistakes" beats "one big mistake"

Picture the atmosphere as a bathtub for each gas: the tap is **emissions**, the drain is **removal**, the water level is **concentration**.

- **Methane = big drain.** About 9 years to drain half-ish. The level quickly settles near *emissions × lifetime*. Mathematically (one-box model):

$$
\frac{dB}{dt}=E-\frac{B}{\tau}\quad\Rightarrow\quad
B(t)=E\tau+\big(B_0-E\tau\big)\,e^{-t/\tau}
$$

 With $E$ = 575 Tg/yr ✔ (Global Methane Budget, 2010–2019), $\tau$ = 9.1 yr: steady-state burden = 5,233 Tg ≈ **1,836 ppb** (using **1 ppb CH₄ = 2.85 Tg** ✔ computed). Observed ≈ 1,912 ppb in 2022 ✔ — the toy model is within 4 %. **If emissions are cut by 166 Tg/yr (≈ 45 % of the 369 Tg human-caused part†), the burden falls to ≈ 1,480 ppb after 10 yr and ≈ 1,365 ppb after 20 yr** (computed) — a rapid response. *Methane concentration follows current emissions (a "flow gas").*

- **CO₂ = almost no drain.** Only the ocean and biosphere can take it up, gradually, and ≈ 22 % of any pulse stays for millennia (§3.2). The level follows **cumulative emissions** ($\int E\,dt$), so **even steady emissions keep raising concentration**, and *stopping* emissions mostly *halts* warming rather than reversing it (the "zero-emissions commitment" is roughly zero ± 0.3 °C†). *CO₂ concentration follows the running total (a "stock gas").*

**Numerical demonstration of your intuition:**

| | CO₂ | CH₄ | Ratio |
| :-- | :-: | :-: | :-: |
| Molecules in the air (ppm → ppb) | 426,000 ppb | 1,942 ppb | CO₂ has **≈ 220× more** molecules |
| Heat per molecule (RE per ppb, AR5) | 1.37×10⁻⁵ | 3.63×10⁻⁴ | CH₄ is **≈ 26× stronger** per molecule (≈ 73× per kg) |
| Forcing from the *increase* since 1750 | 2.16 W/m² | 0.54 W/m² | **CO₂ ≈ 4× larger** |
| Time a pulse persists | centuries–millennia | ≈ 12 yr | CO₂ **far longer** |

Weak per molecule × enormous numbers × persistence = **CO₂ dominates total warming**. Strong per molecule × short life = **methane dominates what we can change fastest.**

---

## 4. Metrics: GWP, GTP, GWP\*, CO₂e

Different gases trap different amounts of heat and last different lengths of time, so we need a common currency. Every currency below is a different *trade-off* between those two properties.

### 4.1 Global Warming Potential (GWP)

**Definition.** The **absolute global warming potential (AGWP)** of gas $x$ over time horizon $H$ is the total extra energy (per m²) added to the climate system by a **1 kg pulse** emitted today, accumulated up to year $H$:

$$
\text{AGWP}_x(H)=\int_0^{H}\text{RF}_x(t)\,dt = A_x\int_0^{H}\text{IRF}_x(t)\,dt
$$

- $A_x$ = radiative efficiency **per kilogram** (W m⁻² kg⁻¹): how strongly 1 kg of the gas, once mixed into the atmosphere, traps heat.
- $\text{IRF}_x(t)$ = fraction of the pulse still airborne after $t$ years (§3.2, §3.3).

$$
\boxed{\;\text{GWP}_x(H)=\frac{\text{AGWP}_x(H)}{\text{AGWP}_{\text{CO}_2}(H)}\;}
$$

**Converting radiative efficiency (per ppb) to per kg:**

$$
A_x=\text{RE}_x\;\frac{M_{\text{air}}}{M_x}\;\frac{10^{9}}{M_{\text{atm}}},\qquad M_{\text{air}}=28.97\ \text{g/mol},\ M_{\text{atm}}=5.148\times10^{18}\ \text{kg}
$$

(1 ppb of gas $x$ weighs $\tfrac{M_x}{M_{air}}M_{atm}\times10^{-9}$ kg; dividing RE by this mass gives per-kg.)

**Worked derivation — reproducing the published GWP of methane from scratch** (computed ✔):

| Step | CO₂ | CH₄ |
| :-- | :-- | :-- |
| Radiative efficiency (AR5) | 1.37×10⁻⁵ W m⁻² ppb⁻¹ | 3.63×10⁻⁴ W m⁻² ppb⁻¹ |
| Molar mass | 44.01 | 16.04 |
| $A_x$ per kg | **1.75×10⁻¹⁵** W m⁻² kg⁻¹ | **1.27×10⁻¹³** W m⁻² kg⁻¹ |
| Decay | $\text{IRF}$ sum of exponentials | single exponential, τ = 12.4 yr, ×1.65 indirect effects |
| $\int_0^{H}$ at **H = 20** | 14.24 yr → AGWP = **2.49×10⁻¹⁴** | 12.4(1−e^(−20/12.4)) = 9.93 yr → AGWP = **2.08×10⁻¹²** |
| $\int_0^{H}$ at **H = 100** | 52.34 yr → AGWP = **9.17×10⁻¹⁴** | 12.4(1−e^(−100/12.4)) = 12.4 yr → AGWP = **2.60×10⁻¹²** |
| **GWP** | 1 | **GWP-20 = 83.6**, **GWP-100 = 28.4** |

Matches AR5's published **84 and 28** ✔. Replacing methane's radiative efficiency with the Etminan 2016 value (4.48×10⁻⁴) gives **GWP-100 ≈ 32.4** ✔, in agreement with the paper's "28 → 32".

**For a gas with a single-exponential lifetime τ:**

$$
\int_0^{H}e^{-t/\tau}\,dt=\tau\big(1-e^{-H/\tau}\big)\ \xrightarrow{\ H\gg\tau\ }\ \tau
$$

**Why GWP depends on the time horizon (the key insight).** Once $H\gg\tau$, a short-lived gas has delivered *all* the heat it ever will (≈ $A_x\tau$) while CO₂'s denominator keeps growing with $H$. So for methane: **GWP-20 ≈ 82 > GWP-100 ≈ 30 > GWP-500 ≈ 7–10**. For long-lived gases such as N₂O (τ ≈ 109 yr) GWP changes little between 20 and 100 yr (273 → 273) and falls only at 500 yr (130).

**Which horizon?** 100 years is a convention (adopted in the Kyoto Protocol); it is a *policy choice*, not a physical truth. GWP-20 emphasises near-term warming (rate of change); GWP-100 balances; GWP-500 emphasises long-run (CO₂-like) effects.

### 4.2 Which GWP set? (version history)

| Report | Year | CH₄ | N₂O | SF₆ | Notes |
| :-- | :-: | :-: | :-: | :-: | :-- |
| IPCC SAR (2nd Assessment) | 1995 | 21† | 310† | 23,900† | Still used in some national legacy inventories and in the Kyoto first commitment period |
| AR4 | 2007 | 25† | 298† | 22,800† | |
| AR5 | 2013 | 28 (34 with climate-carbon feedback)† | 265 (298 with)† | 23,500† | Used for Paris Agreement transparency reporting (UNFCCC)† |
| **AR6** | 2021 | **27.0 non-fossil / 29.8 fossil** ✔ | **273** ✔ | **25,200** ✔ | Most up-to-date; recommended by GHG Protocol for new corporate inventories† |

*Rule:* **never compare CO₂e figures computed with different GWP sets**; always state the report (e.g. "AR6 GWP-100"). A footprint with a lot of methane can shift by ±10–20 % just by changing the GWP set.

### 4.3 Global Temperature change Potential (GTP)

$$
\text{GTP}_x(H)=\frac{\Delta T_x(H)}{\Delta T_{\text{CO}_2}(H)},\qquad
\Delta T(t)=\int_0^{t}\text{RF}(t')\,\text{IRF}_T(t-t')\,dt',\qquad
\text{IRF}_T(t)=\sum_{j=1}^{2}\frac{c_j}{d_j}e^{-t/d_j}
$$

$\text{IRF}_T$ is the **temperature response function** — how the global temperature responds to a unit pulse of forcing, with a fast (upper-ocean, $d_1$ ≈ 4–8 yr) and a slow (deep ocean, $d_2$ ≈ 240–410 yr) timescale (AR5: $c_1=0.631$, $c_2=0.429$ K/(W m⁻²), $d_1=8.4$ yr, $d_2=409.5$ yr†).

GTP asks: "**how much hotter is the planet at year $H$** because of this gas?" GWP asks "how much total heat was added up to year $H$?" For methane the GTP-100 (≈ 4–6†) is much smaller than the GWP-100 (≈ 28) because by year 100 the methane is long gone and the ocean has largely forgotten its warming; for N₂O (long-lived) GTP-100 ≈ 234† ≈ its GWP. GTP is closer to a temperature-target view; GWP to an energy view.

### 4.4 GWP\* (GWP-star): treating short-lived gases as *flows*

GWP treats every emission as an independent **pulse**. But continuing, *constant* methane emissions do **not** keep adding new warming — the concentration stabilises (§3.9) and warming levels off — whereas constant CO₂ emissions keep adding warming (cumulative). GWP\* corrects this by tying the warming effect to the **change in the emission rate**:

$$
E^{*}_{\text{CO}_2\text{-we}}(t)=\text{GWP}_{H}\left[\,r\,\frac{\Delta E_{\text{SLCP}}}{\Delta t}\,H\;+\;s\,E_{\text{SLCP}}(t)\right],\qquad
\Delta E=E(t)-E(t-\Delta t)
$$

- Parameters ✔ (Cain et al. 2019; Smith et al. 2021): $r=0.75$, $s=0.25$, $\Delta t=20$ yr, $H=100$ yr.
- "CO₂-we" = CO₂-**w**arming-**e**quivalent emissions: the CO₂ emission *rate* that would cause the same temperature change.

**Worked example (methane, GWP-100 = 29.8):**

| Scenario | GWP-100 says (Tg CO₂e/yr) | GWP\* says (Tg CO₂-we/yr) |
| :-- | :-: | :-: |
| Constant 100 Tg CH₄/yr for 20 yr | 100 × 29.8 = **2,980** | 29.8 × [0.75 × 0 × 100 + 0.25 × 100] = **745** |
| Emissions fall 100 → 90 Tg/yr over 20 yr | 90 × 29.8 = **2,682** | 29.8 × [0.75 × (−10/20) × 100 + 0.25 × 90] = 29.8 × (−37.5 + 22.5) = **−447** (net cooling) |

So GWP\* says: *stabilising* livestock methane stops adding warming; *cutting* it actively cools. GWP-100 can't see that. **Controversy:** GWP\* gives lower "credit" to countries with historic high methane levels who keep emissions flat, and it is **not accepted for official national inventories** (where GWP-100 remains the reporting standard); it is used in research and some agricultural-sector analyses. Always state which metric you used.

### 4.5 CO₂e arithmetic and unit conversions

$$
\text{CO}_2\text{e}=\sum_i m_i\,\text{GWP}_i
\qquad\text{(mass } m_i \text{ of gas } i\text{, same unit as result)}
$$

| Conversion | Factor | Reason |
| :-- | :-: | :-- |
| C → CO₂ | **× 44.01/12.011 = 3.664** | CO₂ has the mass of one carbon *plus* two oxygen atoms |
| N → N₂O (N₂O-N → N₂O) | **× 44.01/28.01 = 1.571** | N₂O contains two N atoms (28.01 g/mol) in 44.01 g/mol of molecule — IPCC inventories report soil N₂O as "kg N₂O–N" first |
| C → CH₄ | **× 16.04/12.011 = 1.336** | |
| 1 Gt C | = 3.664 Gt CO₂ | |
| 1 Pg = 1 Gt = 10⁹ t; 1 Tg = 1 Mt | | |
| 1 ppm CO₂ | = 2.134 GtC = 7.82 GtCO₂ ✔ | atmosphere mass |
| 1 ppb CH₄ | = 2.85 Tg CH₄ ✔ | |
| 1 ppb N₂O | = 7.82 Tg N₂O ✔ (= 4.98 Tg N) | |

**Worked example — CO₂e of a 100-cow dairy herd's enteric methane.** Illustrative Tier-2 factor of 112 kg CH₄/head/yr (GE = 300 MJ/day, Yₘ = 5.7 %; derivation in §5.4):

$$
100\times112=11{,}200\ \text{kg CH}_4=11.2\ \text{t CH}_4
$$

| Metric | CO₂e |
| :-- | :-: |
| GWP-100 (AR6 non-fossil, 27.0) | 11.2 × 27.0 = **302 t CO₂e** |
| GWP-20 (AR6 non-fossil, 79.7) | 11.2 × 79.7 = **893 t CO₂e** |
| GWP-100 (AR5, 28) | 11.2 × 28 = **314 t CO₂e** |

Same cows, same methane, but the "footprint" ranges from ~300 to ~900 t depending on the metric. This is why metric choice must be reported.

### 4.6 Choosing a metric — decision guide

| If your question is … | Use … | Why |
| :-- | :-- | :-- |
| Official reporting, inventories, carbon markets, corporate scope accounting | **GWP-100** (state AR5 or AR6) | Required by convention; comparable across sources |
| "How much does cutting methane help the next 20 years?" | **GWP-20** (as a *complement*) | Near-term warming/rate of change |
| "What temperature will we hit in 2100?" | **GTP-100** or a climate model | Directly about temperature at a date |
| "Does holding livestock methane flat stop warming?" | **GWP\*** or a model | Flow behaviour of short-lived gases |
| Cumulative budgets (1.5 °C) | **CO₂ only + separate non-CO₂ pathway** (the TCRE framework, §2.7) | Budget logic requires CO₂ to be treated as a stock |

---

## 5. Calculating emissions from each source

This is the engine room: *how do we actually put a number on a cow, a rice field, a landfill or a cement works?* The standard recipes come from the **IPCC Guidelines for National Greenhouse Gas Inventories (2006)** and its **2019 Refinement**, which countries use for their UN reports. Companies use the closely related **GHG Protocol**.

### 5.1 Methodological framework

**Three tiers of detail (IPCC):**

| Tier | Inputs | Accuracy | Typical use |
| :-: | :-- | :-- | :-- |
| **1** | Global default emission factors, coarse activity data (e.g. national livestock count) | lowest (±30–100 % for some sources) | Countries with limited data; quick estimates |
| **2** | Country- or region-specific factors; more detailed parameters (diet energy, manure systems) | medium | Most developed-country inventories for key sources |
| **3** | Process models, direct measurement, facility-level data | highest | Large point sources (power plants, cement kilns), research |

**Four calculation approaches:**

1. **Emission-factor method** (most common): $E=\text{AD}\times\text{EF}$ (§1).
2. **Mass-balance method:** $E_{CO_2}=\Big(\sum C_{\text{in}}-\sum C_{\text{out}}\Big)\times\tfrac{44}{12}$ — used for steel, ammonia, chemicals; conserves carbon exactly.
3. **Direct measurement:** continuous emission monitors in smokestacks; flux chambers on soil; eddy-covariance towers; flights and satellites measuring plumes.
4. **Atmospheric inversion ("top-down"):** measure gas concentrations in the air, run an atmospheric transport model backwards to infer sources. The Global Methane Budget compares **bottom-up** (inventories + process models) with **top-down** (inversions) estimates, which agree to within about 10 % in total but differ by source.

**Good-practice principles (TACCC):** Transparency, Accuracy, Completeness, Consistency, Comparability.

**Rules of reporting:** compute each gas separately in its own mass unit first (t CO₂, t CH₄, t N₂O), *then* convert to CO₂e (§4.5). Never convert early.

---

### 5.2 Fuel combustion (stationary and mobile): CO₂, CH₄, N₂O

#### CO₂ — chemistry first

Burning any hydrocarbon fuel (carbon + hydrogen) in oxygen:

$$
\text{C}_x\text{H}_y+\Big(x+\tfrac{y}{4}\Big)\text{O}_2\;\longrightarrow\;x\,\text{CO}_2+\tfrac{y}{2}\,\text{H}_2\text{O}
$$

Every carbon atom becomes a CO₂ molecule, so the CO₂ per kg of fuel is fixed by its **carbon mass fraction** $w_C$:

$$
\frac{\text{kg CO}_2}{\text{kg fuel}}=w_C\times\frac{44.01}{12.011}=3.664\,w_C
$$

| Fuel | Idealised formula | Calculation | kg CO₂ per kg fuel |
| :-- | :-- | :-- | :-: |
| Methane (natural gas) | CH₄ | 44.01/16.04 | **2.74** ✔ |
| Octane (gasoline proxy) | C₈H₁₈ | 8×44.01/114.23 | **3.08** ✔ |
| Dodecane-like (diesel proxy) | ≈C₁₂H₂₃ | 12×44.01/167.3 | ≈ 3.16 |
| Bituminous coal (≈ 75 % C) | – | 3.664 × 0.75 | ≈ 2.7 |

**Why methane has the lowest CO₂ per unit of energy:** four of its five atoms are hydrogen, which burns to water (no CO₂) while still releasing heat. CH₄ at a lower heating value of 50.0 MJ/kg gives $2.74/50.0\times1000\approx55$ g CO₂/MJ ✔, versus ≈ 69 g/MJ for gasoline and ≈ 95 g/MJ for coal.

#### IPCC Tier-1 equation

$$
E_{\text{CO}_2}=\sum_{f}\underbrace{\text{FC}_f\times\text{NCV}_f}_{\text{energy, TJ}}\times\underbrace{\text{EF}_{\text{CO}_2,f}}_{\text{kg CO}_2/\text{TJ}}\times\text{OF}_f
$$

- **FC** = fuel consumed (tonnes, litres or m³ → convert to mass).
- **NCV** (net calorific value, also "lower heating value") = energy released per unit mass of fuel, excluding the latent heat of water vapour.
- **EF** = derived from carbon content: $\text{EF}=C_{\text{content}}\ (\text{kg C/GJ})\times\tfrac{44}{12}$.
- **OF** = *oxidation factor*, fraction of carbon actually oxidised (IPCC 2006 default = **1.00**).

**Default factors:**

| Fuel | NCV (GJ/t) | CO₂ EF (kg/TJ = g/MJ) | Carbon content (kg C/GJ) |
| :-- | :-: | :-: | :-: |
| Motor gasoline | **44.3** ✔ | **69,300** ✔ | 18.9 |
| Gas/diesel oil | **43.0** ✔ | **74,100** ✔ | 20.2 |
| Natural gas (per t) | **48.0** ✔ | **56,100** ✔ | 15.3 |
| Other bituminous coal | **25.8** ✔ | **94,600** ✔ | 25.8 |
| LPG | 47.3† | 63,100† | 17.2 |
| Crude oil | 42.3† | 73,300† | 20.0 |
| Kerosene / jet kerosene | 43.8† / 44.1† | 71,900† / 71,500† | 19.6 / 19.5 |
| Residual fuel oil | 40.4† | 77,400† | 21.1 |
| Sub-bituminous coal | 18.9† | 96,100† | 26.2 |
| Lignite | 11.9† | 101,000† | 27.6 |
| Anthracite | 26.7† | 98,300† | 26.8 |

**Worked examples** (✔ computed):

$$
\textbf{Gasoline, 1 litre (}\rho=0.74\text{ kg/L): }\ 0.74\times44.3=32.8\ \text{MJ}\ \to\ 32.8\times69.3=2{,}272\ \text{g}\approx\mathbf{2.27\ kg\ CO_2/L}
$$
$$
\textbf{Diesel, 1 litre (}\rho=0.84\text{): }\ 0.84\times43.0=36.1\ \text{MJ}\ \to\ 36.1\times74.1=2{,}676\ \text{g}\approx\mathbf{2.68\ kg\ CO_2/L}
$$
$$
\textbf{Bituminous coal, 1 tonne: }\ 25.8\ \text{GJ}\times94.6\ \text{kg/GJ}=\mathbf{2{,}441\ kg\ CO_2}
$$
$$
\textbf{Natural gas, 1 m}^3\text{ (}\rho\approx0.72\text{ kg/m}^3\text{): }\ 0.72\times48.0=34.6\ \text{MJ}\ \to\ 34.6\times56.1\approx\mathbf{1.94\ kg\ CO_2/m^3}
$$

Published factors vary slightly with fuel density and country (e.g. US EPA's 8.887 kg CO₂/gal for gasoline = 2.35 kg/L†); the ≈ 2.3 kg/L (gasoline) and ≈ 2.68 kg/L (diesel) values are the usual "rules of thumb". *(The earlier primer's 5.83 kg/L for diesel is a typo; 2.68 is correct.)*

#### CH₄ and N₂O from combustion

These are **tiny by mass** but are products of *incomplete* combustion and of nitrogen chemistry at high temperature, so they depend on **technology**, not on carbon content:

$$
E_{\text{CH}_4,\text{N}_2\text{O}}=\sum_{f,t}\text{FC}_f\times\text{NCV}_f\times\text{EF}_{f,t}
$$

| Source category | CH₄ (kg/TJ) | N₂O (kg/TJ) |
| :-- | :-: | :-: |
| Power plants (all fossil) | 1–3† | 0.6–1.5† |
| Road transport, gasoline, uncontrolled | 33† | 3.2† |
| Road transport, diesel | 3.9† | 3.9† |
| Residential wood/biomass burning | ≈ 300† | ≈ 4† |
| Residential natural gas | ≈ 5† | ≈ 0.1† |

*Why catalysts matter:* three-way catalysts cut CO and NOₓ but, if mis-tuned, they **raise N₂O** (an unintended side-reaction). Biomass stoves emit lots of CH₄, CO and black carbon because wood burns incompletely.

**Biogenic CO₂.** By IPCC convention, CO₂ from burning *biomass* (wood, ethanol, biogas) is **not counted in the energy sector** because the carbon was recently taken from the air; it is reported as a memo item and any net change in forest carbon is accounted for in land use (§5.12). CH₄ and N₂O from burning biomass **are** counted.

#### Distance-based transport estimate (when fuel data are missing)

$$
E=\sum_{v}N_v\times\text{VKT}_v\times\text{FE}_v\times\text{EF}_f
$$

$N$ = number of vehicles, VKT = vehicle-kilometres per vehicle, FE = fuel economy (L/km), EF = kg CO₂/L. *Fuel-based (litres bought) is more accurate for CO₂ than distance-based*, because CO₂ is set purely by the fuel's carbon; CH₄ and N₂O need the distance-based approach with technology classes.

---

### 5.3 Electricity and heat (Scope 2, grids, and lifecycle comparison)

**Scope 2 equation** (purchased electricity):

$$
E_{\text{scope 2}}=Q_{\text{kWh}}\times\text{EF}_{\text{grid}}
$$

**Where the grid factor comes from.** The grid EF is a generation-weighted average of every plant's emissions:

$$
\text{EF}_{\text{grid}}=\frac{\sum_i G_i\,\text{EF}_i}{\sum_i G_i},\qquad
\text{EF}_i\ [\text{g/kWh}]=\frac{\text{EF}_{\text{fuel},i}\ [\text{g/MJ}]}{\eta_i}\times3.6
$$

($\eta_i$ = plant thermal efficiency, 1 kWh = 3.6 MJ.) Examples ✔ (computed):

| Plant type | Fuel EF (g/MJ) | η | EF (g CO₂/kWh) |
| :-- | :-: | :-: | :-: |
| Coal steam | 94.6 | 0.34 | **1,002** |
| Gas, simple-cycle (OCGT) | 56.1 | 0.38 | **531** |
| Gas, combined-cycle (CCGT) | 56.1 | 0.55 | **367** |
| Wind, solar, hydro, nuclear (operation) | 0 | – | **0** (lifecycle ≈ 11–48, below) |

**Illustrative grid:** 40 % gas CCGT + 30 % coal + 30 % non-fossil → $0.4\times367+0.3\times1002+0.3\times0=447$ g/kWh ✔.

**Transmission and distribution losses** (≈ 5–8 %†) mean consumers must be charged for energy lost in wires: $\text{EF}_{\text{consumed}}=\text{EF}_{\text{gen}}/(1-\ell)$.

**Location-based vs market-based Scope 2** (GHG Protocol 2015): location-based uses the *average grid* factor where the electricity is used; market-based uses supplier-specific factors, power purchase agreements or certificates (REC/GO). Companies must report both. **Average vs marginal:** a *marginal* factor reflects the plant that ramps up/down when demand changes (often gas or coal), which can be much higher than the average factor and matters for evaluating demand-side measures.

**Life-cycle emissions of electricity technologies** (IPCC AR5 WGIII Annex III medians, g CO₂e/kWh†):

| Technology | Coal | Gas CC | Biomass (dedicated) | Solar PV (utility) | Solar PV (rooftop) | CSP | Geothermal | Hydro | Nuclear | Wind onshore | Wind offshore |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **g CO₂e/kWh** | 820 | 490 | 230 | 48 | 41 | 27 | 38 | 24 | 12 | 11 | 12 |

(Lifecycle numbers include construction, fuel supply and, for gas, upstream methane leakage — which is why gas lifecycle (490) exceeds its direct combustion factor (≈ 370–420).)

**Heat.** Boiler: $\text{EF}_{\text{heat}}=\text{EF}_{\text{fuel}}/\eta_{\text{boiler}}$ (gas boiler ≈ 90 % → $56.1/0.9\times3.6\approx224$ g CO₂/kWh_th ✔). **Heat pump:** delivers heat $Q$ for electricity $W=Q/\text{COP}$ → $\text{EF}_{\text{heat}}=\text{EF}_{\text{grid}}/\text{COP}$. With grid = 400 g/kWh: COP 3 → **133 g/kWh_th**; COP 4 → **100 g/kWh_th** ✔ — roughly half of a gas boiler even on a fairly dirty grid. **Combined heat and power (CHP)** shares emissions between electricity and heat by efficiency, energy-content or exergy methods; the allocation choice changes the reported split but not the total.

---

### 5.4 Livestock enteric fermentation (CH₄)

**The biology (what you called "cattle burps").** Ruminants (cattle, buffalo, sheep, goats, camels, deer) have a four-chamber stomach whose first chamber, the **rumen**, hosts trillions of microbes that ferment plant fibre. Fermentation produces volatile fatty acids (energy for the animal) plus **H₂ and CO₂**; archaea then convert these to methane (§3.3: $\text{CO}_2+4\text{H}_2\rightarrow\text{CH}_4+2\text{H}_2\text{O}$). The gas is mostly released by **eructation** (belching) — not flatulence†. Non-ruminant livestock (pigs, horses, poultry) produce far less, mainly in the hindgut. Methane represents a **loss of feed energy** (typically 2–12 % of gross energy intake).

**Tier 1 (simple):**

$$
E_{\text{CH}_4,\text{ent}}=\frac{\sum_T \text{EF}_T\,N_T}{10^{6}}\qquad(\text{Gg CH}_4/\text{yr};\ \text{EF in kg head}^{-1}\text{yr}^{-1})
$$

Representative IPCC 2006 defaults, kg CH₄/head/yr† (the 2019 Refinement revised several upward for high-producing dairy):

| Animal | Developed regions | Developing regions |
| :-- | :-: | :-: |
| Dairy cattle | ≈ 99–128 (N. America 128; W. Europe 117; E. Europe 99) | ≈ 46–72 (India 58; Asia 68; Latin America 72; Africa 46) |
| Other cattle | ≈ 53–60 | ≈ 27–56 |
| Buffalo | – | 55 |
| Sheep | 8 | 5 |
| Goats | 5 | 5 |
| Swine | 1.5 | 1 |
| Horses | 18 | 18 |

**Tier 2 (energy-based) — the core equation** ✔ (verified against the IPCC 2006 Volume 4 text and worked examples):

$$
\boxed{\;\text{EF}=\frac{\text{GE}\times\big(Y_m/100\big)\times365}{55.65}\;}\qquad[\text{kg CH}_4\ \text{head}^{-1}\text{yr}^{-1}]
$$

- **GE** = *gross energy intake* (MJ/head/day): all the energy in the feed eaten.
- **Yₘ** = *methane conversion factor*: percentage of GE lost as methane. Defaults ✔/†: **6.5 %** grazing cattle; **≈ 5.7 %** high-producing dairy cows (example value); **3.0 %** feedlot cattle (grain-rich diet); sheep 6.5 % (lambs lower)†.
- **55.65 MJ/kg** = energy content of methane (so dividing GE × Yₘ by 55.65 converts MJ to kg CH₄).
- **365** = days per year.

**Gross energy from animal requirements** ✔ (IPCC 2006 Eq 10.16, structure verified; coefficients †):

$$
\text{GE}=\frac{\dfrac{\text{NE}_m+\text{NE}_a+\text{NE}_l+\text{NE}_{work}+\text{NE}_p}{\text{REM}}+\dfrac{\text{NE}_g+\text{NE}_{wool}}{\text{REG}}}{\text{DE}\%/100}
$$

| Term | Meaning | Formula (MJ/day) |
| :-- | :-- | :-- |
| NE$_m$ | Net energy for **maintenance** (staying alive) | $\text{Cf}\times W^{0.75}$; Cf = 0.386 (lactating cow), 0.322 (other cattle), 0.370 (bulls)† |
| NE$_a$ | **Activity** (walking, grazing) | $C_a\times\text{NE}_m$; stall 0, pasture 0.17, large-area grazing 0.36† |
| NE$_l$ | **Lactation** | $\text{Milk}\times(1.47+0.40\times\text{Fat\%})$† |
| NE$_{work}$ | Draught work | $0.10\times\text{NE}_m\times\text{hours}$† |
| NE$_p$ | **Pregnancy** | $C_p\times\text{NE}_m$, $C_p=0.10$ cattle† |
| NE$_g$ | **Growth** | $22.02\left(\dfrac{BW}{C\cdot MW}\right)^{0.75}WG^{1.097}$† |
| REM, REG | Ratio of net energy available for maintenance / growth to digestible energy | $\text{REM}=1.123-4.092{\times}10^{-3}\text{DE}+1.126{\times}10^{-5}\text{DE}^2-25.4/\text{DE}$; $\text{REG}=1.164-5.160{\times}10^{-3}\text{DE}+1.308{\times}10^{-5}\text{DE}^2-37.4/\text{DE}$† |
| DE% | **Digestibility** of feed (% of GE digestible): ≈ 55–60 grazing, 65–75 dairy/feedlot† | – |

$W$ = body weight (kg).

**Worked example A (simple):** GE = 300 MJ/day, Yₘ = 5.7 % →

$$
\text{EF}=\frac{300\times0.057\times365}{55.65}=\mathbf{112\ kg\ CH_4/yr}\ ✔
$$

≈ 0.307 kg/day = 0.46 m³/day ≈ **460 litres/day** (CH₄ density 0.67 kg/m³) — consistent with the widely quoted 250–500 L per cow per day†.

**Worked example B (full build-up for a high-yield dairy cow):** $W$ = 600 kg, 25 kg milk/day at 4 % fat, grazing on pasture, pregnant, DE = 70 % ✔ computed:

| Step | Value |
| :-- | :-: |
| NE$_m$ = 0.386 × 600^0.75 | 46.8 MJ/day |
| NE$_a$ = 0.17 × 46.8 | 8.0 |
| NE$_l$ = 25 × (1.47 + 0.40×4) | 76.8 |
| NE$_p$ = 0.10 × 46.8 | 4.7 |
| Sum | 136.2 |
| REM at DE = 70 | 0.529 |
| **GE** = 136.2 / 0.529 / 0.70 | **368 MJ/day** |
| **EF** at Yₘ = 5.7 % | **137.5 kg CH₄/yr** (≈ 562 L/day) |
| EF at Yₘ = 6.5 % | 156.8 kg CH₄/yr |

**CO₂e of that cow:** 137.5 × 27.0 (AR6 GWP-100, non-fossil) ≈ **3.7 t CO₂e/yr** from belching alone, before manure, feed production and land.

**Herd-level:** $E=\sum_T N_T\times\text{EF}_T$; 1 million such dairy cows → 137.5 Gg CH₄ → 3.7 Mt CO₂e.

**Mitigation levers and their arithmetic:**

- **Feed quality / concentrate share:** raising digestibility and grain share lowers Yₘ (grazing 6.5 % → feedlot 3.0 % cuts methane per unit of GE by 54 %, but grain has its own land and N₂O costs).
- **Additives:** 3-NOP (an enzyme inhibitor) reduces enteric CH₄ by roughly 25–40 %†; seaweed *Asparagopsis* up to ≈ 80 % in short trials†; nitrate ≈ 10–15 %†; ionophores small. Effects shrink or fade in the long term in some studies.
- **Productivity:** more milk per cow lowers CH₄ **per litre** even though per-cow emissions rise; the herd shrinks for the same output.
- **Breeding, vaccines:** research stage.

---

### 5.5 Manure management (CH₄ and N₂O)

Manure releases gases while stored, depending on **oxygen**: kept wet and airless (lagoons, slurry tanks) it ferments to **CH₄**; kept dry and aerated it makes little CH₄ but **N₂O** through nitrogen chemistry.

**CH₄ — Tier 2** ✔ (IPCC 2006 Eq 10.23–10.24, structure verified):

$$
\text{EF}_{\text{CH}_4}=\big(\text{VS}\times365\big)\times\Big[B_o\times0.67\ \tfrac{\text{kg}}{\text{m}^3}\times\sum_{S,k}\frac{\text{MCF}_{S,k}}{100}\times\text{MS}_{S,k}\Big]
$$
$$
\text{VS}=\Big[\text{GE}\,\big(1-\tfrac{\text{DE}\%}{100}\big)+\text{UE}\cdot\text{GE}\Big]\times\frac{1-\text{ASH}}{18.45}
$$

- **VS** = *volatile solids* excreted (kg dry matter/head/day): the organic part of manure that can ferment. Feed that is **not digested** ($1-\text{DE}$) plus **urinary energy** (UE ≈ 0.04 of GE†) is excreted; dividing by 18.45 MJ/kg converts energy to dry mass; $(1-\text{ASH})$ removes the mineral ash (≈ 8 % for cattle†).
- **B$_o$** = *maximum methane producing capacity* (m³ CH₄ per kg VS): dairy ≈ 0.24, other cattle ≈ 0.17–0.19, swine ≈ 0.45, poultry ≈ 0.32, sheep ≈ 0.19†.
- **0.67 kg/m³** = density of methane ✔.
- **MCF** = *methane conversion factor* (%): the share of B$_o$ actually realised in a given storage system at a given temperature. Ranges† from **≈ 0.1 %** (daily spreading on land) through **solid storage ≈ 2–5 %**, **liquid/slurry ≈ 17–40 %** (higher in warm climates), up to **≈ 66–80 % for warm anaerobic lagoons**.
- **MS** = fraction of manure handled in each system.

**Worked example** — dairy cow, GE = 300 MJ/day, DE = 65 %, UE = 0.04, ash 0.08, B$_o$ = 0.24 ✔ computed:

$$
\text{VS}=[300\times0.35+12]\times\frac{0.92}{18.45}=\mathbf{5.83\ kg/day}
$$

| Storage system (MCF†) | EF (kg CH₄/head/yr) | CO₂e at GWP 27 |
| :-- | :-: | :-: |
| Daily spread (0.1 %) | 0.3 | 9 kg |
| Solid storage (4 %) | 13.7 | 370 kg |
| Liquid/slurry, cool climate (17 %) | 58.2 | 1.6 t |
| Warm anaerobic lagoon (70 %) | **239.7** | **6.5 t** |

The same cow's manure can emit anywhere from ≈ 0 to ≈ 240 kg CH₄ depending only on how it is stored — this is why **manure management (covering lagoons, anaerobic digesters, frequent removal, drying)** is a major, relatively cheap mitigation option.

**N₂O — direct** ✔ (IPCC 2006 Eq 10.25, structure verified):

$$
\text{N}_2\text{O}_{D(mm)}=\Big[\sum_S\Big(\sum_T N_T\,\text{Nex}_T\,\text{MS}_{T,S}\Big)\text{EF}_{3(S)}\Big]\times\frac{44}{28}
$$

- **Nex** = nitrogen excreted (kg N/head/yr): $\text{Nex}=N_{rate}\times\tfrac{\text{TAM}}{1000}\times365$ (cattle ≈ 60–120 kg N/head/yr depending on size and protein intake†).
- **EF$_3$** (kg N₂O–N per kg N excreted, by system)†: anaerobic lagoon ≈ **0** (no oxidised nitrogen without oxygen), liquid/slurry with natural crust **0.005**, without crust 0, solid storage **0.005**, **dry lot 0.02**, deep bedding 0.01–0.07, composting ≈ 0.006–0.1.
- **44/28** converts N₂O–N to N₂O mass.

**Worked example** (Nex = 100 kg N/head/yr, ✔ computed): slurry with crust → 100 × 0.005 × 44/28 = 0.79 kg N₂O (**215 kg CO₂e**); dry lot (EF₃ = 0.02) → **3.14 kg N₂O (858 kg CO₂e)**. Notice the **trade-off**: lagoons make lots of CH₄ but no N₂O; dry systems the reverse.

**Indirect N₂O** (from nitrogen that escapes as ammonia gas or leaches, then converts to N₂O elsewhere):

$$
\text{N}_{vol}=\sum\Big(N_T\text{Nex}_T\text{MS}_{T,S}\cdot\tfrac{\text{Frac}_{GasMS}}{100}\Big),\quad
\text{N}_2\text{O}_{G}=\text{N}_{vol}\times\text{EF}_4\times\tfrac{44}{28};\qquad
\text{N}_2\text{O}_{L}=\text{N}_{leach}\times\text{EF}_5\times\tfrac{44}{28}
$$

with EF₄ (volatilisation) = 0.010 (2006) → 0.014 wet climates (2019)†, EF₅ (leaching/runoff) = 0.0075 (2006) → 0.011 (2019) ✔, and Frac$_{GasMS}$ ≈ 20–40 % of excreted N depending on system†.

---

### 5.6 Rice cultivation (CH₄)

**The mechanism.** Flooding a rice paddy cuts off oxygen from the soil within hours. Soil microbes then use up alternative "electron acceptors" in sequence — nitrate (NO₃⁻), manganese(IV), iron(III), sulphate (SO₄²⁻) — and only when these are exhausted does methanogenesis start (acetate splitting and CO₂ + H₂ routes, §3.3). Methane reaches the air mainly by travelling up through the plant's internal air channels (**aerenchyma**; ≈ 60–90 % of flux†), by bubbles, and by diffusion; some is oxidised by methane-eating bacteria near the roots (≈ 10–30 %†). More organic matter (straw, manure) and **continuous flooding** = more CH₄.

**IPCC Tier 1** ✔ (verified):

$$
\text{CH}_{4,\text{Rice}}=\sum_{i,j,k}\text{EF}_{i,j,k}\times t_{i,j,k}\times A_{i,j,k}\times10^{-6}
$$
$$
\text{EF}_i=\text{EF}_c\times\text{SF}_w\times\text{SF}_p\times\text{SF}_o\times\text{SF}_{s,r}
$$

- **EF$_c$** = baseline emission factor for continuously flooded fields *without* organic amendments: **1.30 kg CH₄/ha/day** (IPCC 2006) ✔, revised to **1.19** (0.80–1.76) in the 2019 Refinement ✔.
- **$t$** = cultivation period (days); **$A$** = harvested area (ha).
- **SF$_w$** (water regime during the season) ✔: continuously flooded **1.0**; single drainage (mid-season aeration) **0.60**; multiple drainage **0.52**; upland rice **0**.
- **SF$_p$** (pre-season water regime): e.g. flooded > 30 days before planting adds; non-flooded < 180 days = 1.0†.
- **SF$_o$** (organic amendments): $\big(1+\sum_i \text{ROA}_i\times\text{CFOA}_i\big)^{0.59}$†, with ROA = application rate (t/ha dry matter) and CFOA = conversion factor: straw incorporated shortly (< 30 days) before cultivation **1.0**, straw incorporated long (> 30 days) before 0.29, farmyard manure 0.14, green manure 0.50, compost 0.05†.
- **SF$_{s,r}$** = soil type, rice cultivar (default 1).

**Worked example** — 1 hectare, 100-day season, 4 t/ha straw incorporated just before planting (SF$_o$ = (1+4)^0.59 = 2.58†), EF$_c$ = 1.30 (2006 default) ✔ computed:

| Water management | SF$_w$ | EF (kg/ha/day) | Season CH₄ (kg/ha) | CO₂e at GWP 27.0 |
| :-- | :-: | :-: | :-: | :-: |
| Continuous flooding | 1.00 | 3.35 | **336** | **9.1 t** |
| Single mid-season drainage | 0.60 | 2.01 | **202** | **5.4 t** |
| Multiple drainage (AWD) | 0.52 | 1.75 | **175** | **4.7 t** |

So **alternate wetting and drying (AWD)** cuts rice methane by ≈ 40–48 % in this example (field studies report ≈ 30–50 %†) and saves water. *Caveat:* drained soils are better aerated so **N₂O can rise** (nitrification and denitrification both active); compute both:

$$
\Delta\text{CO}_2\text{e}=\Delta\text{CH}_4\times27.0+\Delta\text{N}_2\text{O}\times273
$$

AWD still wins in most studies because CH₄ savings are large compared with the N₂O increase, but it is not guaranteed.

**Straw management:** incorporating straw early (> 30 days before flooding) or composting it instead of incorporating fresh before flooding can cut SF$_o$ drastically (CFOA 1.0 → 0.29 or 0.05); *burning* straw avoids CH₄ from the soil but releases CO, soot (black carbon), CH₄ and N₂O (§5.12) and air pollution.

**Scale:** rice paddies account for roughly **30 Tg CH₄/yr globally**† (≈ 8 % of anthropogenic methane; see §6) on ≈ 160–165 million hectares†.

---

### 5.7 Agricultural soils (N₂O)

**The biology.** Soil microbes recycle nitrogen. N₂O leaks out of two processes (§3.4): **nitrification** (aerobic: ammonium → nitrate) and **denitrification** (oxygen-poor: nitrate → nitrogen gas, with N₂O as an intermediate):

$$
\text{NH}_4^{+}+\tfrac32\,\text{O}_2\rightarrow\text{NO}_2^{-}+2\,\text{H}^{+}+\text{H}_2\text{O}\ \ \rightarrow\ \text{NO}_3^{-}\qquad(\text{N}_2\text{O as by-product})
$$
$$
2\,\text{NO}_3^{-}+10\,e^-+12\,\text{H}^+\rightarrow\text{N}_2+6\,\text{H}_2\text{O}\quad(\text{via NO}_2^-\rightarrow\text{NO}\rightarrow\text{N}_2\text{O}\rightarrow\text{N}_2)
$$

N₂O emission peaks when **mineral nitrogen is abundant** (fertiliser, manure), the soil is **wet but not waterlogged** (water-filled pore space ≈ 60–80 %†), **warm**, **compacted** and rich in easily decomposed carbon. This explains why emissions spike after fertilising followed by rain.

**IPCC Tier-1 — direct emissions** (2006 Eq 11.1, 11.2, 11.5 structure; values below):

$$
\text{N}_2\text{O}_{\text{Direct}}\text{–N}=\text{N}_2\text{O–N}_{\text{N inputs}}+\text{N}_2\text{O–N}_{\text{OS}}+\text{N}_2\text{O–N}_{\text{PRP}}
$$
$$
\text{N}_2\text{O–N}_{\text{N inputs}}=\big(F_{SN}+F_{ON}+F_{CR}+F_{SOM}\big)\times\text{EF}_1
$$
$$
\text{N}_2\text{O–N}_{\text{OS}}=A_{OS}\times\text{EF}_2,\qquad
\text{N}_2\text{O–N}_{\text{PRP}}=F_{PRP}\times\text{EF}_{3PRP}
$$

| Symbol | Nitrogen input | How computed |
| :-- | :-- | :-- |
| $F_{SN}$ | **Synthetic fertiliser** N (kg N/yr) | Sales/application statistics |
| $F_{ON}$ | **Organic** N: manure, compost, sewage sludge applied | Nex × fraction applied (§5.5) |
| $F_{CR}$ | **Crop residue** N returned to soil | below |
| $F_{SOM}$ | N mineralised from **soil organic matter** lost through land-use change | $\sum\big(\Delta C_{\text{mineral}}\cdot\tfrac1R\big)\times1000$, with $R$ = C:N ratio (≈ 15; 10 for forest-to-cropland†) |
| $F_{PRP}$ | **Manure deposited directly by grazing animals** (pasture, range, paddock) | $\sum N_T\,\text{Nex}_T\,\text{MS}_{PRP}$ |
| $A_{OS}$ | **Area of drained organic soils** (peat) | ha |

**Crop residue nitrogen:**

$$
F_{CR}=\sum_T\Big\{\text{Crop}_T\cdot\text{Area}_T\cdot\text{Frac}_{Renew,T}\cdot\Big[R_{AG,T}\,N_{AG,T}\big(1-\text{Frac}_{Remove,T}-\text{Frac}_{Burn,T}\,c_f\big)+R_{BG,T}\,N_{BG,T}\Big]\Big\}
$$

($R_{AG}$, $R_{BG}$ = above-/below-ground residue-to-crop ratios; $N_{AG}$, $N_{BG}$ = nitrogen contents; Frac$_{Remove}$ = fraction removed for feed/bedding; Frac$_{Burn}$ = fraction burned; $c_f$ = combustion factor.)

**Emission factors (kg N₂O–N per kg N applied) — IPCC 2006 vs 2019 Refinement** ✔ (verified):

| Factor | **2006** (aggregated) | **2019 Refinement** (disaggregated) |
| :-- | :-: | :-: |
| EF₁ synthetic fertiliser + organic N | **0.010** (range 0.003–0.030) | **0.016** wet climates (0.013–0.019) · **0.005** dry climates (0.000–0.011) |
| EF₁ organic N amendments, wet climates | – | **0.006** (0.001–0.011) |
| EF₂ (drained organic soil, cropland, temperate) | 0.008† | 0.013† (revised; tropical higher) |
| EF₃PRP (grazing deposits) | 0.020 cattle/poultry/pigs; 0.010 sheep/other† | wet 0.006 cattle; dry 0.002; sheep 0.003† |

The **2019 Refinement** replaced one global 1 % factor with climate-specific values because measurements showed synthetic fertiliser in wet climates leaks **more** N₂O than the old average, and dry climates less.

**IPCC Tier-1 — indirect emissions** (nitrogen that leaves the field first, then makes N₂O elsewhere):

$$
\text{N}_2\text{O}_{(ATD)}\text{–N}=\Big[F_{SN}\cdot\text{Frac}_{GASF}+(F_{ON}+F_{PRP})\cdot\text{Frac}_{GASM}\Big]\times\text{EF}_4
$$
$$
\text{N}_2\text{O}_{(L)}\text{–N}=\big(F_{SN}+F_{ON}+F_{PRP}+F_{CR}+F_{SOM}\big)\times\text{Frac}_{LEACH}\times\text{EF}_5
$$

(ATD = atmospheric deposition of volatilised NH₃/NOₓ. Leaching applies only in regions where rain exceeds evaporation.)

| Parameter | 2006 | 2019 Refinement |
| :-- | :-: | :-: |
| Frac$_{GASF}$ (fraction of synthetic N lost as NH₃, NOₓ) | 0.10 | 0.11† |
| Frac$_{GASM}$ (fraction of organic N volatilised) | 0.20 | 0.21† |
| Frac$_{LEACH}$ (fraction of N lost by leaching/runoff) | 0.30 | 0.24 ✔ |
| EF₄ (kg N₂O–N per kg N volatilised) | 0.010 | 0.014 wet / 0.005 dry† ✔ (wet) |
| EF₅ (per kg N leached) | 0.0075 | 0.011 ✔ |

**Total and conversion:**

$$
\text{N}_2\text{O}_{\text{total}}=\Big(\text{N}_2\text{O}_{\text{Direct}}\text{–N}+\text{N}_2\text{O}_{ATD}\text{–N}+\text{N}_2\text{O}_{L}\text{–N}\Big)\times\frac{44}{28}
$$

**Worked example — 100 kg N/ha of synthetic fertiliser** ✔ computed:

| Pathway | 2006 factors | 2019, wet climate |
| :-- | :-: | :-: |
| Direct (EF₁) | 100 × 0.010 × 1.571 = 1.571 kg N₂O | 100 × 0.016 × 1.571 = 2.514 kg |
| Volatilisation (indirect) | 100×0.10×0.010×1.571 = 0.157 | 100×0.11×0.014×1.571 = 0.242 |
| Leaching (indirect) | 100×0.30×0.0075×1.571 = 0.354 | 100×0.24×0.011×1.571 = 0.415 |
| **Total N₂O** | **2.08 kg** | **3.17 kg** |
| **CO₂e (×273)** | **568 kg** | **866 kg** (≈ 8.7 kg CO₂e per kg N applied) |

In a dry climate (EF₁ = 0.005) direct emission would be only 100×0.005×1.571 = 0.79 kg N₂O (215 kg CO₂e; indirect pathways smaller†). **Add the manufacturing footprint**: each kg of fertiliser N costs ≈ 2–6 kg CO₂e to make† (see §5.8), so the application-phase N₂O (≈ 4–9 kg CO₂e/kg N) is of similar size to the factory emissions.

**Mitigation arithmetic.** Define **nitrogen use efficiency**: $\text{NUE}=N_{\text{removed in crop}}/N_{\text{input}}$. Raising NUE reduces surplus N that feeds both N₂O and leaching. Practices (the "4Rs": right rate, right source, right time, right place), nitrification inhibitors (DCD, DMPP, reduce N₂O ≈ 30–50 %†), controlled-release fertiliser, splitting applications, avoiding waterlogging, legume rotations. A 20 % cut in N input at constant yield cuts N₂O roughly proportionally (EF₁ is treated as linear at Tier 1, though real response is non-linear and rises steeply at over-application†).

---

### 5.8 Fertiliser and industrial-chemical production

#### Ammonia (the base of nitrogen fertiliser): CO₂

**Haber–Bosch synthesis** combines nitrogen from air with hydrogen:

$$
\text{N}_2+3\,\text{H}_2\rightleftharpoons2\,\text{NH}_3\qquad(\Delta H=-92\ \text{kJ/mol}\ \text{per 2 NH}_3,\ \sim400\text{–}500\,^\circ\text{C},\ 150\text{–}300\ \text{bar})
$$

Hydrogen almost always comes from **steam methane reforming**, which releases CO₂ as a chemical by-product:

$$
\text{CH}_4+\text{H}_2\text{O}\rightarrow\text{CO}+3\,\text{H}_2,\qquad
\text{CO}+\text{H}_2\text{O}\rightarrow\text{CO}_2+\text{H}_2\ \ \Rightarrow\ \ \text{net: CH}_4+2\,\text{H}_2\text{O}\rightarrow\text{CO}_2+4\,\text{H}_2
$$

**Stoichiometric minimum.** Each NH₃ needs 1.5 H₂; each CH₄ supplies 4 H₂ → 0.375 mol CO₂ per mol NH₃ →

$$
0.375\times\frac{44.01}{17.03}=\mathbf{0.97\ t\ CO_2\ per\ t\ NH_3}\ ✔\ (\text{reaction chemistry alone})
$$

Real plants burn extra natural gas for heat and compression: ≈ **1.6–2.0 t CO₂/t NH₃** for good natural-gas plants, global average ≈ 2.4†, coal-based ≈ 3.5–4.5†. Ammonia is ≈ 1.2–1.5 % of global CO₂ emissions†. **Green ammonia** replaces reforming with electrolysis (2 H₂O → 2 H₂ + O₂) driven by renewable electricity.

**Urea** (CO(NH₂)₂) is made by reacting NH₃ with CO₂ (so some process CO₂ is temporarily locked up), but once applied to a field the urea hydrolyses and **releases that CO₂**:

$$
\text{CO(NH}_2)_2+\text{H}_2\text{O}\rightarrow2\,\text{NH}_3+\text{CO}_2\ \Rightarrow\ \text{EF}=\frac{12.011}{60.06}=0.200\ \text{t C/t urea}=\mathbf{0.733\ t\ CO_2/t\ urea}\ ✔
$$

#### Liming of soils (CO₂)

$$
\text{CaCO}_3+2\,\text{H}^{+}\rightarrow\text{Ca}^{2+}+\text{H}_2\text{O}+\text{CO}_2
$$

Stoichiometric C fractions: limestone $12.011/100.09=0.12$ t C/t; dolomite CaMg(CO₃)₂: $2\times12.011/184.4=0.13$ t C/t ✔ (matching IPCC defaults 0.12 and 0.13).

#### Nitric acid (HNO₃, for fertiliser) — N₂O by-product

$$
4\,\text{NH}_3+5\,\text{O}_2\rightarrow4\,\text{NO}+6\,\text{H}_2\text{O};\quad 2\,\text{NO}+\text{O}_2\rightarrow2\,\text{NO}_2;\quad 3\,\text{NO}_2+\text{H}_2\text{O}\rightarrow2\,\text{HNO}_3+\text{NO}
$$

N₂O forms as an unwanted side-reaction on the platinum catalyst gauze. Uncontrolled IPCC defaults†: ≈ 2 kg N₂O/t HNO₃ (high-pressure plants), ≈ 5 (medium-pressure), ≈ 9 (older atmospheric-pressure plants). At 9 kg N₂O/t: $9\times273=2.46$ t CO₂e per tonne of acid ✔ — often more than the CO₂ from the ammonia used. **Abatement** (tertiary catalysts) cuts ≈ 80–99 %†, making this one of the cheapest large mitigation options in the whole economy.

#### Adipic acid (nylon-6,6) — a stoichiometric N₂O source

Adipic acid is made by oxidising cyclohexanol/cyclohexanone with nitric acid; stoichiometrically each mole of product releases about one mole of N₂O:

$$
\frac{44.01}{146.14}=0.301\ \text{t N}_2\text{O per t adipic acid}\ ✔\ \ (\text{IPCC default ≈ 300 kg/t uncontrolled}\ \dagger)
$$

$0.300\times273=\mathbf{82\ t\ CO_2e}$ per tonne of adipic acid uncontrolled ✔ — an enormous value; thermal/catalytic destruction (≈ 90–99 % removal†) cut global adipic-acid N₂O sharply since the 1990s. Similar N₂O by-products occur in caprolactam and glyoxal production†.

---

### 5.9 Waste: landfills, wastewater, incineration, composting

#### 5.9.1 Solid-waste disposal sites (CH₄) — first-order decay

**The biology.** Buried organic waste is first decomposed with some oxygen (producing CO₂), then, once buried and compacted, becomes anaerobic; bacteria and archaea ferment it into **landfill gas ≈ 50 % CH₄ + 45–50 % CO₂†** over decades. Decay speed depends on waste type, moisture and temperature.

**IPCC first-order decay (FOD) method** ✔ (verified, 2006 Vol 5 Ch 3):

$$
\text{DDOC}_m=W\times\text{DOC}\times\text{DOC}_f\times\text{MCF}
$$
$$
\text{DDOC}_{m,a,T}=\text{DDOC}_{m,d,T}+\text{DDOC}_{m,a,T-1}\,e^{-k}
$$
$$
\text{DDOC}_{m,\text{decomp},T}=\text{DDOC}_{m,a,T-1}\,\big(1-e^{-k}\big)
$$
$$
\text{CH}_4\text{ generated}_T=\text{DDOC}_{m,\text{decomp},T}\times F\times\frac{16}{12}
$$
$$
\boxed{\;\text{CH}_4\text{ emitted}_T=\Big[\sum\text{CH}_4\text{ generated}_T-R_T\Big]\times(1-\text{OX}_T)\;}
$$

| Symbol | Meaning | Defaults |
| :-- | :-- | :-- |
| $W$ | Mass of waste deposited (t) | – |
| **DOC** | *Degradable organic carbon*: fraction of waste that is degradable carbon (tC/t waste) | food ≈ 0.15, garden ≈ 0.20, paper ≈ 0.40, wood ≈ 0.43, textiles ≈ 0.24†, sludge ≈ 0.05† |
| **DOC$_f$** | Fraction of DOC that actually decomposes (lignin does not) | **0.5** ✔ |
| **MCF** | *Methane correction factor* for site management | managed anaerobic **1.0** ✔; semi-aerobic **0.5** ✔; unmanaged deep (≥ 5 m) **0.8** ✔; unmanaged shallow **0.4** ✔; uncategorised **0.6** ✔ |
| $k$ | Decay rate constant (yr⁻¹) | food ≈ 0.06 (dry/cool) to 0.185 (wet temperate) to 0.40 (wet tropical); garden 0.05–0.17; paper 0.04–0.07; wood 0.02–0.035; textiles 0.04–0.07† |
| **F** | Fraction of CH₄ in landfill gas | **0.5** ✔ |
| 16/12 | Convert carbon mass to CH₄ mass | – |
| $R$ | CH₄ **recovered** (captured, flared or used for energy) | site data |
| **OX** | Oxidation of CH₄ in the cover soil by methane-eating bacteria | 0 (default) or **0.1** (managed, well-covered) ✔ |

**Half-life of waste decay** $t_{1/2}=\ln2/k$: food waste ($k$ = 0.185) **3.7 yr**; paper (0.06) **11.6 yr**; wood (0.03) **23.1 yr** ✔.

**Worked example — 1,000 t of food waste (DOC 0.15) in a managed anaerobic landfill (MCF = 1), $k$ = 0.185, OX = 0.1** ✔ computed:

- DDOC$_m$ = 1000 × 0.15 × 0.5 × 1.0 = **75 t C**.
- Total CH₄ that will ever be generated = 75 × 0.5 × 16/12 = **50 t**; emitted after oxidation = **45 t**.

| Year after burial | 1 | 2 | 3 | 5 | 10 | 15 | 20 | 40 |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| CH₄ emitted that year (t) | 7.6 | 6.3 | 5.3 | 3.6 | 1.4 | 0.6 | 0.2 | ≈ 0 |
| Cumulative (t) | 7.6 | 13.9 | 19.2 | 27.2 | 37.9 | 42.2 | 43.9 | 45.0 |

45 t CH₄ × 27.0 = **1,215 t CO₂e** from 1,000 t of food waste (≈ 1.2 t CO₂e per tonne), ≈ 85 % emitted within 10 years. **Gas capture** changes the last term: with 70 % collection and flaring the net emission falls to ≈ 30 % (flaring turns CH₄ into CO₂ at ≈ 98 % destruction efficiency† — and the CO₂ is biogenic, not counted). **Mitigation hierarchy:** prevent food waste → compost/anaerobic digestion (§5.9.4) → capture landfill gas → biocovers.

**Why the CO₂ from landfills isn't counted but CH₄ is:** waste carbon originated from plants that recently absorbed CO₂, so the CO₂ is "short-cycle"; methane, however, is a *new* greenhouse gas created only because the waste was buried without oxygen.

#### 5.9.2 Wastewater treatment and discharge

**CH₄** (IPCC 2006 Vol 5 Ch 6; coefficients †):

$$
\text{CH}_4=\Big[\sum_{i,j}\big(U_i\,T_{ij}\,\text{EF}_j\big)\Big]\times\big(\text{TOW}-S\big)-R
$$
$$
\text{TOW}=P\times\text{BOD}\times0.001\times I\times365,\qquad \text{EF}_j=B_o\times\text{MCF}_j
$$

- **TOW** = total organic matter in wastewater (kg BOD/yr). **BOD** (*biochemical oxygen demand*) measures how much oxygen microbes need to decompose the waste — a proxy for organic load; ≈ 40–60 g BOD/person/day†. $P$ = population, $I$ = industrial correction factor (1.00–1.25)†.
- $B_o$ = **0.6 kg CH₄ per kg BOD** (or 0.25 kg CH₄/kg COD)†.
- **MCF** by treatment/discharge route†: untreated into sea/river 0.1; stagnant sewer 0.5; anaerobic deep lagoon 0.8; anaerobic digester (uncaptured leaks) 0.8 (before recovery); well-managed aerobic plant ≈ 0.
- $U_i$ = income-group share; $T_{ij}$ = treatment-route utilisation; $S$ = BOD removed as sludge; $R$ = CH₄ recovered.

**N₂O from effluent** (nitrogen in human protein):

$$
\text{N}_2\text{O}_{\text{effluent}}=N_{\text{effluent}}\times\text{EF}_{\text{effluent}}\times\frac{44}{28},\quad
N_{\text{effluent}}=\big(P\times\text{Protein}\times F_{NPR}\times F_{NON\text{-}CON}\times F_{IND\text{-}COM}\big)-N_{\text{sludge}}
$$

with EF$_{effluent}$ = 0.005 kg N₂O–N/kg N (2006)†.

#### 5.9.3 Incineration and open burning

Only **fossil carbon** (plastics, synthetic textiles, rubber) counts; biogenic carbon is excluded:

$$
E_{\text{CO}_2}=\sum_i\text{SW}_i\times\text{dm}_i\times\text{CF}_i\times\text{FCF}_i\times\text{OF}_i\times\frac{44}{12}
$$

$\text{SW}_i$ = mass of waste type $i$; dm = dry-matter fraction; CF = carbon fraction of dry matter; **FCF** = *fossil carbon fraction* (≈ 1.0 for plastics, ≈ 0 for food); OF = oxidation factor (1.0 for modern incinerators; ≈ 0.58 for open burning†). Example: 1 t of plastic waste (IPCC-type defaults: dm 1.0, CF 0.75, FCF 1.0, OF 1.0): $0.75\times3.664=\mathbf{2.75}$ t CO₂ per tonne of plastic burned. Open burning also emits CH₄, N₂O, CO, soot and toxic dioxins — a large health hazard in places without waste collection.

#### 5.9.4 Composting and anaerobic digestion

Defaults†: **composting** emits ≈ 4 g CH₄ and ≈ 0.3 g N₂O per kg of wet waste (range wide; poorly aerated piles emit far more CH₄); **anaerobic digestion** emits ≈ 1 g CH₄/kg wet waste from leaks (but *captures* the biogas for energy; leak rates > 3–4 % erode the benefit†). The digestate fertiliser then carries N₂O risk in soils.

---

### 5.10 Fossil-fuel fugitive emissions (CH₄) — oil, gas and coal

"Fugitive" = escapes that are not the intended combustion product.

#### Oil and natural gas

Sources: **venting** (deliberate release of associated gas), **flaring** (burning waste gas; imperfect), **equipment leaks** (valves, flanges, compressors), **pneumatic controllers** (gas-powered valves that bleed gas by design), **tank flashing**, **liquids unloading**, pipeline and **distribution** leaks, **abandoned wells**. Measurements show **fat-tailed ("super-emitter")** distributions: a small percentage of sites or events cause a large share of emissions†, so inventories using average factors tend to *under-estimate*; aircraft and satellite surveys now find and quantify them.

**Leakage rate** (the key metric) = methane lost ÷ methane produced or delivered:

$$
L=\frac{E_{\text{CH}_4}}{P_{\text{CH}_4}}
$$

**What leakage does to the climate benefit of natural gas.** Burning 1 MJ of methane (LHV 50 MJ/kg) uses 0.020 kg CH₄ and gives 54.9 g CO₂ ✔. A leakage rate $L$ (fraction of production lost) adds $\tfrac{L}{1-L}\times0.020$ kg CH₄ per MJ delivered. With GWP-100 = 29.8 and GWP-20 = 82.5 ✔ (all computed):

| Leakage $L$ | CH₄ leaked (g/MJ) | CO₂e (100-yr) | **Total g CO₂e/MJ (100-yr)** | **Total g CO₂e/MJ (20-yr)** |
| :-: | :-: | :-: | :-: | :-: |
| 0.5 % | 0.10 | 3.0 | **57.9** | 63.2 |
| 1 % | 0.20 | 6.0 | **60.9** | 71.5 |
| 2 % | 0.41 | 12.2 | **67.0** | 88.5 |
| 3 % | 0.62 | 18.4 | **73.3** | 105.9 |
| 5 % | 1.05 | 31.4 | **86.2** | **141.7** |

Compare with coal combustion at ≈ 94.6 g CO₂/MJ ✔ and gasoline at 69.3 g/MJ ✔. **Break-even leakage vs coal *combustion only*:** ≈ 6.2 % (100-yr basis) and ≈ **2.4 %** (20-yr basis) ✔ computed. *(A fair comparison must add coal's own upstream methane — see below — so gas's real advantage is larger than this simplified comparison implies.)* This is why measuring and reducing leaks is the cheapest large-scale mitigation in the energy sector (much of the leaked gas is saleable).

**Flaring:** design combustion efficiency ≈ 98 %† (CH₄ → CO₂), but field measurements show lower averages (≈ 90–95 %†) due to wind, unlit flares and over-steaming.

#### Coal mining

Coal seams hold adsorbed methane ("coal-bed methane", firedamp). Mining releases it from ventilation shafts (often as dilute **ventilation air methane**, 0.1–1 %, hard to capture) and post-mining from stored coal. **Tier 1†:**

$$
E_{\text{CH}_4}=\text{Production (t)}\times\text{EF (m}^3/\text{t)}\times0.67\ \tfrac{\text{Gg}}{10^{6}\,\text{m}^3}\ \ ✔
$$

Defaults†: underground mining 10–25 m³/t (mid ≈ 18), post-mining 0.9–4.0 m³/t; surface mining 0.3–2.0 m³/t, post-mining 0.1–0.4 m³/t. **Example:** 1 Mt of coal from underground mines at 18 m³/t = 18×10⁶ m³ × 0.67 = **12.1 Gg CH₄** = $12.1\times29.8=\mathbf{359}$ kt CO₂e, versus combustion CO₂ of 2,441 kt (§5.2) → methane from mining adds **≈ 15 %** to the footprint of burning that coal ✔ computed. Abandoned mines keep leaking for decades.

---

### 5.11 Industrial processes

Two kinds of emission occur at factories: **combustion CO₂** (fuel burned for heat — counted in §5.2) and **process emissions** (the chemistry of the product itself — counted here). Process emissions persist even if the fuel is switched to electricity.

#### Cement and lime — calcination

Cement clinker is made by heating limestone to ≈ 1,450 °C. The key reaction (calcination) is chemical decomposition:

$$
\text{CaCO}_3\;\xrightarrow{\ \sim900\,^\circ\text{C}\ }\;\text{CaO}+\text{CO}_2\qquad\Rightarrow\qquad\frac{44.01}{56.08}=\mathbf{0.785\ t\ CO_2\ per\ t\ CaO}\ ✔
$$

Clinker is ≈ 65 % CaO, so $0.65\times0.785=\mathbf{0.51\ t\ CO_2/t\ clinker}$ ✔ (IPCC default 0.52† including MgO and other carbonates):

$$
E_{\text{process}}=M_{\text{clinker}}\times\text{EF}_{\text{clinker}}\times\text{CF}_{\text{CKD}}\qquad(\text{CF}_{\text{CKD}}\approx1.02\text{ for kiln-dust correction}^\dagger)
$$

Plus **fuel** to heat the kiln: ≈ 3.3–3.5 GJ/t clinker† × coal (≈ 95 g/MJ) ≈ 0.31–0.33 t CO₂/t clinker†. Total ≈ **0.85–0.9 t CO₂ per tonne of clinker**; per tonne of cement (clinker ratio ≈ 0.7–0.75†) ≈ 0.6–0.7 t. About **half to 60 %** of cement's CO₂ is chemistry, so electrification cannot fix it; options: **clinker substitution** (fly ash, slag, calcined clay), **alternative fuels**, **carbon capture** on the kiln; cement slowly re-absorbs some CO₂ through **carbonation** (≈ 20–30 % of calcination CO₂ over the structure's life†). **Lime** (CaO) follows the same equation: ≈ 0.75 t CO₂/t high-calcium lime† (accounting for purity). **Glass and soda ash:** $\text{Na}_2\text{CO}_3\rightarrow\text{Na}_2\text{O}+\text{CO}_2$ → $44.01/105.99=0.415$ t CO₂/t soda ash ✔; limestone flux 0.44 t CO₂/t.

#### Iron and steel — carbon as chemical reductant

Iron ore (Fe₂O₃) must have its oxygen removed. In a **blast furnace**, coke (carbon) does this:

$$
\text{C}+\text{O}_2\rightarrow\text{CO}_2,\quad \text{CO}_2+\text{C}\rightarrow2\,\text{CO},\quad \text{Fe}_2\text{O}_3+3\,\text{CO}\rightarrow2\,\text{Fe}+3\,\text{CO}_2
$$

$$
\text{Net (idealised): } 2\,\text{Fe}_2\text{O}_3+3\,\text{C}\rightarrow4\,\text{Fe}+3\,\text{CO}_2\ \Rightarrow\ \frac{3\times44.01}{4\times55.845}=\mathbf{0.59\ t\ CO_2/t\ Fe}\ ✔\ (\text{theoretical minimum})
$$

Real values are ≈ 3× higher because of extra coke for heat and carbon alloying: **BF–BOF ≈ 1.8–2.2 t CO₂/t crude steel†**; **scrap-EAF ≈ 0.3–0.6†** (mostly the electricity); **gas-DRI-EAF ≈ 1.4†**; **hydrogen-DRI** (Fe₂O₃ + 3 H₂ → 2 Fe + 3 H₂O) near zero with green hydrogen and clean electricity. IPCC Tier-1 process defaults†: BOF 1.46, EAF 0.08, open hearth 1.72 t CO₂/t steel. Carbon **mass balance** (preferred):

$$
E_{\text{CO}_2}=\Big(\sum_{\text{inputs}}M_iC_i-\sum_{\text{outputs}}M_oC_o\Big)\times\frac{44}{12}
$$

Inputs: coke, coal injection, limestone flux, electrodes; outputs: carbon in steel, slag, by-product gases sold.

#### Aluminium — anode CO₂ and perfluorocarbons

**Hall–Héroult electrolysis** dissolves alumina in molten cryolite and passes ≈ 150–600 kA through carbon anodes, which burn away:

$$
2\,\text{Al}_2\text{O}_3+3\,\text{C}\rightarrow4\,\text{Al}+3\,\text{CO}_2\qquad\Rightarrow\qquad\frac{3\times44.01}{4\times26.98}=\mathbf{1.22\ t\ CO_2/t\ Al}\ ✔\ (\text{stoichiometric})
$$

Real anode CO₂ ≈ 1.5–1.6 t/t† (extra consumption by air-burn and CO₂ reaction). **The biggest term is electricity:** ≈ 14 MWh/t Al†; at 0.5 kg CO₂/kWh that is **≈ 7 t CO₂/t Al** ✔ — five times the anode chemistry, so smelter location (hydro vs coal grid) dominates the footprint.

**PFC emissions** ("anode effects"): when alumina is depleted, the cell voltage spikes and fluorine from cryolite combines with carbon, making CF₄ and C₂F₆. **Slope method** ✔ structure (coefficients †):

$$
E_{\text{CF}_4}=S_{\text{CF}_4}\times\text{AEM}\times P_{\text{Al}},\qquad
E_{\text{C}_2\text{F}_6}=E_{\text{CF}_4}\times F_{\text{C}_2\text{F}_6/\text{CF}_4}
$$

AEM = anode-effect minutes per cell-day; $P_{Al}$ = tonnes of aluminium; slope $S_{CF_4}$ (kg CF₄/t Al per AE-min/cell-day)†: **0.143** (centre-worked prebake), 0.272 (side-worked prebake), 0.092 / 0.099 (vertical/horizontal Søderberg); weight ratio $F$: 0.121, 0.053, 0.053, 0.085†. **Worked example** (centre-worked prebake, AEM = 0.5): CF₄ = 0.143×0.5 = 0.0715 kg/t Al; C₂F₆ = 0.0715×0.121 = 0.00865 kg/t → CO₂e = 0.0715×7,380 + 0.00865×12,400 = **635 kg CO₂e/t Al** ✔ computed. Modern smelters operate at AEM < 0.5 min/cell-day, near zero for best practice.

#### Semiconductors, flat panels and solar cells (F-gas use)

Etching and chamber cleaning use CF₄, C₂F₆, CHF₃, SF₆, NF₃, c-C₄F₈. Only part of the gas is destroyed in the process; the rest escapes unless abated:

$$
E_i=\text{FC}_i\times(1-U_i)\times\big(1-a_i\,d_i\big)
$$

FC = gas consumed, $U$ = **utilisation** (fraction consumed in the reaction), $a$ = fraction of tools with abatement, $d$ = destruction efficiency of the abatement unit (≈ 90–99 %†), weighted by uptime. Per tonne of NF₃ at 17,400 GWP, each 1 % of unabated release = 174 t CO₂e.

#### Refrigerants and air conditioning (HFCs)

Lifetime emissions of a cooling system:

$$
E_{\text{total}}=E_{\text{charging}}+C\times x_{\text{leak}}\times n_{\text{years}}+E_{\text{servicing}}+C\times\big(1-\eta_{\text{recovery}}\big)\ (\text{end of life})
$$

$C$ = refrigerant charge (kg), $x_{leak}$ = annual leak rate (fraction), $\eta_{recovery}$ = share of charge recovered at disposal. Typical annual leak rates†: domestic fridge 0.3 %; residential A/C 2–10 %; chillers 2–15 %; mobile A/C 10–20 %; commercial/supermarket refrigeration 10–35 %.

**Worked example** — split A/C with 2.0 kg of R-410A (GWP 2,255 ✔), leak 5 %/yr topped up, 12-year life, 70 % of charge recovered at end of life ✔ computed: operating loss 2.0×0.05×12 = 1.2 kg; end-of-life loss 2.0×0.30 = 0.6 kg → **1.8 kg × 2,255 = 4.06 t CO₂e** — more than a year or two of the unit's *electricity* emissions (≈ 1.5 MWh/yr × 0.4 = 0.6 t CO₂/yr). Leakage is therefore a major, often-forgotten share of cooling's climate impact; **Kigali** phase-down moves the industry to HFC-32 (GWP 771), propane (R-290, GWP ≈ 3†) and CO₂ (R-744, GWP 1).

#### Sulphur hexafluoride in electrical equipment

$$
E_{\text{SF}_6}=\text{Installed stock}\times x_{\text{leak}}+\text{(filling and end-of-life losses)}
$$

Leak rates†: older gas-insulated switchgear ≈ 0.5–1 %/yr, new sealed units < 0.1–0.5 %/yr. Example: 100 kg SF₆ inventory leaking 0.5 %/yr = 0.5 kg = **12.6 t CO₂e/yr** (0.5 × 25,200 ✔).

---

### 5.12 Land use, forests, peat and fire (AFOLU: CO₂, CH₄, N₂O)

AFOLU = Agriculture, Forestry and Other Land Use. Land is both a **source** (deforestation, peat drainage, fires) and a **sink** (growing forests, soil carbon). It is the **most uncertain** part of the global carbon budget (≈ ±50 % on land-use-change CO₂†).

#### Carbon stock change (CO₂)

Plants are ≈ 47 % carbon by dry mass (IPCC default **carbon fraction CF = 0.47**†). Any change in carbon stored in vegetation, dead wood, litter and soil is a CO₂ flux:

$$
\Delta C=\Delta C_{\text{biomass}}+\Delta C_{\text{dead wood}}+\Delta C_{\text{litter}}+\Delta C_{\text{soil}}\ ;\qquad
E_{\text{CO}_2}=-\Delta C\times\frac{44}{12}
$$

**Two IPCC methods:**

1. **Stock-difference:** $\Delta C=\dfrac{C_{t_2}-C_{t_1}}{t_2-t_1}$ (inventory at two dates).
2. **Gain–loss:** $\Delta C=\Delta C_{G}-\Delta C_{L}$

$$
\Delta C_G=\sum A\cdot G_{\text{TOTAL}}\cdot\text{CF},\qquad G_{\text{TOTAL}}=\sum G_W\,(1+R)
$$
$$
\Delta C_L=L_{\text{wood removals}}+L_{\text{fuelwood}}+L_{\text{disturbance}},\qquad
L_{\text{wood removals}}=H\cdot\text{BCEF}_R\cdot(1+R)\cdot\text{CF}
$$

$A$ = area (ha), $G_W$ = above-ground biomass growth (t dm/ha/yr), $R$ = root-to-shoot ratio (below-ground/above-ground biomass, ≈ 0.2–0.4†), $H$ = harvested volume (m³), BCEF = biomass conversion and expansion factor (t biomass per m³ of wood).

**Deforestation worked example** (illustrative numbers): 1 ha of tropical forest with above-ground biomass 200 t dm/ha, $R=0.24$ → total 248 t dm → carbon 248 × 0.47 = 116.6 t C → **427 t CO₂/ha** released over time (immediately if burned, over years if left to rot) *plus* loss of future uptake and soil carbon. A forest that is replanted regains carbon over decades — **sequestration is slow, emission is fast**.

**Soil organic carbon:**

$$
\text{SOC}=\text{SOC}_{\text{REF}}\times F_{LU}\times F_{MG}\times F_I\times A
$$

SOC$_{REF}$ = reference stock for the climate/soil type; $F_{LU}$, $F_{MG}$, $F_I$ = stock-change factors for land use, tillage management and organic inputs (e.g. no-till or cover crops raise SOC slowly; ploughing grassland lowers it).

#### Peatlands and drained organic soils

Peat is thousands of years of partly decayed plant matter, with very high carbon density (> 10× mineral soil†). Draining it for crops or oil palm exposes the carbon to oxygen, so it oxidises to CO₂ for as long as it stays drained; IPCC defaults for drained tropical cropland on organic soil are of order **≈ 20 t C/ha/yr = 73 t CO₂/ha/yr**†. Drained peat also emits N₂O (EF₂, §5.7) and in ditches CH₄; peat fires are huge CO₂ events. **Rewetting** halts most of the CO₂ but raises CH₄ — the net gain must be computed with GWPs for both.

#### Fire emissions (biomass burning): CO₂, CH₄, N₂O, plus CO, NOₓ, soot

$$
\boxed{\;L_{\text{fire}}=A\times M_B\times C_f\times G_{ef}\times10^{-3}\;}\qquad[\text{t of gas}]
$$

- $A$ = area burned (ha); $M_B$ = mass of fuel available (t dry matter/ha); **$C_f$** = **combustion factor** (fraction of fuel actually consumed; ≈ 0.3–0.5 for forest fires, ≈ 0.8–0.9 for grass fires†); **$G_{ef}$** = emission factor (g of gas per kg dry matter burned); $10^{-3}$ converts kg-based result to tonnes.
- Representative $G_{ef}$ (g/kg dm)†: CO₂ ≈ 1,580–1,700; CO ≈ 65–110; CH₄ ≈ 2.3 (savanna) to 6.8 (tropical forest); N₂O ≈ 0.2.

**Worked example** (illustrative): burn 1 ha with $M_B$ = 150 t dm/ha, $C_f$ = 0.5 → 75 t dm consumed (75,000 kg):

| Gas | $G_{ef}$ (g/kg) | Emission | CO₂e (AR6 GWP-100) |
| :-- | :-: | :-: | :-: |
| CO₂ | 1,580 | 118.5 t | 118.5 t |
| CH₄ | 6.8 | 510 kg | 510 × 27.0 = 13.8 t |
| N₂O | 0.2 | 15 kg | 15 × 273 = 4.1 t |
| **Total** | | | **≈ 136 t CO₂e** (non-CO₂ gases add ≈ 15 %) |

By IPCC convention the **CO₂ from burning biomass in a forest that regrows** is reported through the carbon-stock change (not both), while **CH₄ and N₂O from fire are always added**. **Crop-residue burning** follows the same equation; it also releases black carbon and toxic smoke. Agricultural burning of savanna is treated as largely CO₂-neutral over the regrowth cycle but still adds CH₄ and N₂O.

#### Harvested wood products and "biomass is carbon-neutral"

Wood used in long-lived products stores carbon; wood burned for energy releases it at once. The claim "biomass is carbon neutral" holds only if the carbon released is re-absorbed by regrowth **within a time that matters for climate**; for slow-growing forests the **carbon payback time** (decades to centuries) can exceed climate targets. Therefore accounting must track **stocks over time**, not just "biogenic = zero".

---

### 5.13 Transport specifics

**Road:** §5.2 (fuel-based for CO₂; distance-based for CH₄ and N₂O).

**Aviation.** Jet kerosene: 71.5 g CO₂/MJ† × 44.1 MJ/kg† ≈ **3.15–3.16 kg CO₂ per kg of fuel** (computed). Per passenger:

$$
E_{\text{pax}}=\frac{F_{\text{flight}}\times3.16}{N_{\text{pax}}}\times\text{(cargo/class allocation)}
$$

Typical averages†: ≈ 0.15–0.25 kg CO₂/passenger-km short-haul, ≈ 0.10–0.15 long-haul (more per km for short flights because take-off and climb burn disproportionate fuel). **Non-CO₂ effects** (contrails and cirrus, NOₓ, water vapour at altitude) roughly **triple** aviation's *forcing* compared with its CO₂ alone (ERF ratio ≈ 2.9; Lee et al. 2021†). Because the non-CO₂ effects are short-lived, a GWP-100-based "multiplier" is lower (≈ 1.7†) — again, the metric changes the answer (§4). Sustainable aviation fuel reduces *lifecycle* CO₂ by ≈ 50–80 % depending on feedstock† but not contrails (though cleaner-burning fuel can reduce soot-driven contrails†).

**Shipping.** IMO fuel carbon factors (t CO₂/t fuel)†: heavy fuel oil **3.114**, light fuel oil 3.151, marine diesel/gas oil **3.206**, LNG **2.750**, propane 3.000. **Energy efficiency indicator** (carbon intensity of transport work):

$$
\text{EEOI}=\frac{\sum_j \text{FC}_j\,C_{F,j}}{m_{\text{cargo}}\times D}\qquad[\text{g CO}_2\text{ per tonne-nautical mile}]
$$

LNG engines emit **methane slip** (unburned CH₄ ≈ 2–4 % of fuel†), which can erase LNG's CO₂ advantage on a 20-year basis. Indicative freight intensities†: ship (container) ≈ 10–20 g CO₂/t-km; rail ≈ 20–30; heavy truck ≈ 60–100; air freight ≈ 500–600.

**Electric vehicles — use-phase calculation:** $e_{EV}\ [\text{g/km}]=\dfrac{\epsilon\ [\text{kWh/km}]\times\text{EF}_{\text{grid}}\ [\text{g/kWh}]}{1-\ell_{\text{charge}}}$, with $\epsilon\approx0.18$ kWh/km and charging losses $\ell\approx10$ %. Worked in §7.5.

---

### 5.14 Natural sources and sinks (what happens without us, and what we perturb)

| Gas | Natural source | Magnitude | Notes |
| :-- | :-- | :-- | :-- |
| **CH₄** | **Wetlands and inland waters** (lakes, ponds, rivers) | ≈ **248 Tg/yr** bottom-up, very wide range 159–369 ✔ (Global Methane Budget 2025) | Methanogenesis in waterlogged organic soil; rises with temperature and rainfall (a **climate feedback**) |
| CH₄ | Termites, wild ruminants | ≈ 10–20 Tg/yr† | Termite guts host methanogens |
| CH₄ | Geological seeps, mud volcanoes, marine seeps | ≈ 20–60 Tg/yr† (wide) | Includes natural gas leaking from rocks; recent isotope (¹⁴C) studies suggest fossil-fuel emissions were once under-estimated and geological seeps overestimated† |
| CH₄ | Oceans, hydrates, thawing permafrost | small now† | A major *risk* for future feedback |
| CH₄ | Wildfire | part of 27 Tg biomass+biofuel burning ✔ | – |
| **N₂O** | Soils (nitrification/denitrification), oceans | ≈ 9–10 Tg N/yr† | Natural baseline ≈ 270 ppb |
| **CO₂** | Volcanoes | ≈ 0.3–0.4 GtCO₂/yr† | **Human CO₂ is > 100× volcanic** (≈ 42 vs 0.3–0.4 Gt) — a common myth is that volcanoes emit more |
| **CO₂** | Respiration, decay, ocean outgassing | ≈ 200+ GtC/yr in each direction† | Natural flows are huge but **balanced by uptake**; human emissions are the unbalanced 4–5 % |

**Key sinks** — CH₄: OH ≈ 563 Tg/yr ✔ (≈ 90 %), soils ≈ 30–40†, stratosphere small. CO₂: ocean ≈ 25–30 % and land ≈ 30 % of human emissions†; **weakening sinks** (warm oceans dissolve less gas; droughts and fires reduce forest uptake) are an amplifying feedback. Henry's-law solubility of CO₂ in seawater falls ≈ 4 % per K of warming†.

**Climate–carbon feedbacks to keep in mind:** permafrost thaw (releases CO₂ and CH₄), wetland CH₄ increase, forest dieback and fire, reduced ocean uptake, weakened soil carbon storage. These are included in AR6's climate-carbon feedback adjustment (GWP-100 of CH₄ rises from 28 to 34 in AR5 when included†).

---

## 6. Methane sources in full (and N₂O, CO₂ budgets)

You asked specifically for the **sources of methane**. This section collects them in one place, with the global magnitudes, the mechanism, and where in this document each is calculated.

### 6.1 Global methane budget (2010–2019) ✔

From the *Global Methane Budget 2000–2020* (Saunois et al., 2025, *Earth System Science Data* 17, 1873) — the community assessment combining bottom-up inventories/process models with top-down atmospheric inversions:

| Quantity | Top-down (atmospheric inversion) | Bottom-up (inventories/models) |
| :-- | :-: | :-: |
| **Total global emissions (2010–2019)** | **575 Tg CH₄/yr** (553–586) | – |
| Of which **human-caused (direct anthropogenic)** | **≈ 65 % ≈ 369 Tg/yr** | – |
| **Agriculture and waste** | **228** (213–242) | 211 |
| **Fossil fuels** (coal, oil, gas) | **115** (100–124) | 120 (117–125) |
| **Biomass and biofuel burning** | **27** | – |
| **Wetlands and inland freshwaters (natural + some lake/reservoir)** | – | **248** (159–369) |
| Total chemical sink (tropospheric OH etc.) | **554** | 633 |
| Tropospheric chemical loss | **563** (510–663) | – |
| Emissions in the year **2020** | **608 Tg** (581–627), **12 % above the 2000s** | – |
| Surface concentration (2022) | **1,912 ppb** | – |

Observations from the same assessment: anthropogenic CH₄ is only ≈ 2.5 % of CO₂ in terms of carbon mass, but because of its potency its emissions-based forcing is ≈ **1.19 W/m² (31 %) of the 3.84 W/m² total** from greenhouse-gas emissions and precursors ✔.

### 6.2 Source-by-source table (each human and natural source of methane)

Sub-category magnitudes are bottom-up values from the *Global Methane Budget 2020* (2008–2017)† — treat as approximate; shares are of the ≈ 366 Tg bottom-up anthropogenic total†.

| # | Source | Mechanism | Approx. Tg CH₄/yr† | Share of human CH₄† | Calculated in | Main mitigation |
| :-: | :-- | :-- | :-: | :-: | :-: | :-- |
| **1** | **Ruminant livestock — enteric fermentation** ("cattle burps") | Methanogenic archaea in the rumen convert H₂ + CO₂ (§3.3) | ≈ 85–90† | ≈ 24 % | §5.4 | Feed additives, diet, productivity, breeding, fewer/more efficient animals, lower beef/dairy demand |
| **2** | **Manure management** | Anaerobic decay of volatile solids in lagoons, slurry tanks | ≈ 20–25† | ≈ 6 % | §5.5 | Covers, digesters, solid separation, frequent spreading, drying |
| **3** | **Rice cultivation** | Flooded anaerobic soil | ≈ **30** | ≈ 8 % | §5.6 | Alternate wetting/drying, straw management, short-duration cultivars |
| **4** | **Landfills** | Buried organic waste ferments (FOD model) | ≈ 40–45† | ≈ 12 % | §5.9.1 | Waste prevention, composting, landfill gas capture, biocovers |
| **5** | **Wastewater** | Anaerobic lagoons, sewers, septic systems | ≈ 20–25† | ≈ 6 % | §5.9.2 | Aerobic treatment, biogas capture, sewer connection |
| **6** | **Oil and natural gas** (venting, flaring, leaks, pneumatics, distribution) | Escape of the product itself | ≈ **79** | ≈ 22 % | §5.10 | Leak detection and repair, ban routine venting/flaring, replace pneumatics, satellite monitoring |
| **7** | **Coal mining** (ventilation, drainage, post-mining, abandoned mines) | Release of methane held in coal seams | ≈ **42** | ≈ 11 % | §5.10 | Drainage and utilisation, ventilation air oxidisers, closing mines safely |
| **8** | **Biomass and biofuel burning** (savanna and forest fires, crop-residue fires, cookstoves) | Incomplete combustion | ≈ 17–30† | ≈ 5–8 % | §5.12, §5.2 | Fire management, clean cookstoves, end residue burning |
| **9** | **Natural wetlands and inland waters** | Methanogenesis in waterlogged soil | ≈ **150–250** ✔ | (natural; not in the ≈ 366) | §5.14 | Not directly controllable; climate-sensitive feedback |
| **10** | Termites, geological seeps, oceans, hydrates, permafrost | Various | ≈ 30–80† | (natural) | §5.14 | – |
| – | *Anthropogenic subtotal* | | *≈ 366 (BU) / 369 (TD) ✔* | *100 %* | | |

Cross-check: livestock (≈ 110) + rice (30) + waste (65) ≈ 205 ≈ the 211 agriculture-and-waste bottom-up value ✔; oil and gas (79) + coal (42) = 121 ≈ the fossil bottom-up 120 ✔.

**Takeaways.** (i) Roughly **one-third of human methane is from fossil fuel** (the *cheapest* to cut because gas has market value and leak detection is mature†), **about 40 % from agriculture (livestock + rice)**, **about 20 % from waste**, and the remainder from burning; (ii) livestock is the **single largest source**; (iii) **natural wetlands rival the whole of agriculture and waste** and respond to warming, creating a feedback; (iv) because the sinks nearly balance the sources, small changes in either (OH, wetlands) show up as year-to-year jumps in concentration.

**Mitigation potential:** the UNEP/Climate and Clean Air Coalition *Global Methane Assessment (2021)* found that with existing measures human methane could be cut by roughly **45 % by 2030**, avoiding ≈ 0.3 °C of warming by the 2040s†; the **Global Methane Pledge** (launched 2021) aims for a **30 % cut by 2030** versus 2020†.

### 6.3 Nitrous oxide (N₂O) sources

Total ≈ **17 Tg N/yr (≈ 27 Tg N₂O)**, ≈ 40 % human-caused†.

| Source | Mechanism | Calculated in | Mitigation |
| :-- | :-- | :-: | :-- |
| **Fertilised soils** (synthetic N, manure, residues) | Nitrification/denitrification (§5.7) | §5.7 | Nitrogen-use efficiency, 4Rs, inhibitors |
| **Manure on pasture; manure management** | Same + stored manure chemistry | §5.5, §5.7 | Better storage, covers, manure-N planning |
| **Nitric acid, adipic acid, caprolactam plants** | Chemical by-product | §5.8 | Catalytic abatement (cheap, large, 80–99 % cut†) |
| **Wastewater and aquaculture** | Microbial N processes | §5.9.2 | Nitrogen removal design, feed efficiency |
| **Combustion** (power plants, engines, catalysts), **biomass burning** | High-temperature N chemistry | §5.2, §5.12 | Catalyst tuning |
| **Natural soils and oceans** | Same microbial processes | §5.14 | – |

### 6.4 CO₂ sources and the overall gas mix

**Fossil CO₂ by fuel†:** coal ≈ 40 %, oil ≈ 32 %, natural gas ≈ 21 %, cement process ≈ 4 %, gas flaring and other ≈ 3 %. Total CO₂ emissions (fossil + land use) ≈ **42 GtCO₂/yr** ✔ (2025).

**All greenhouse gases, 2019, in CO₂e (GWP-100)** — per IPCC AR6 Working Group III† (total ≈ **59 GtCO₂e**; 2018 ≈ **58 ± 6.1** ✔):

| Gas | GtCO₂e (2019)† | Share† |
| :-- | :-: | :-: |
| CO₂ from fossil fuel and industry | ≈ 38 | **≈ 64 %** |
| CO₂ from land use (net) | ≈ 6.6 | ≈ 11 % |
| **CH₄** | ≈ 11 | **≈ 18 %** |
| N₂O | ≈ 2.7 | ≈ 4 % |
| Fluorinated gases | ≈ 1.4 | ≈ 2 % |

So in the emissions accounts **CO₂ ≈ three-quarters, CH₄ ≈ one-fifth** — an independent confirmation of §0: CO₂ is the dominant gas by volume of warming caused, with methane second.

**By sector, 2019 (AR6 WGIII, direct emissions, as in the uploaded primer)†:** energy supply ≈ 34 %, industry ≈ 24 %, agriculture-forestry-land use ≈ 22 %, transport ≈ 15 %, buildings ≈ 6 %. If electricity-related emissions are re-allocated to the sector using the power, industry and buildings rise sharply (buildings from ≈ 6 % to ≈ 16–21 %†).

### 6.5 Responsibility lenses: territorial vs consumption-based

$$
E_{\text{consumption}}=E_{\text{territorial}}-E_{\text{embodied in exports}}+E_{\text{embodied in imports}}
$$

A country that imports steel, cement and electronics made abroad has a larger *consumption-based* footprint than its territorial emissions. Rich countries typically show higher consumption-based emissions; China and other exporters lower. Both views are valid; carbon border adjustment mechanisms act on the consumption view.

---

## 7. Footprint accounting: scopes, LCA, input-output

Sections 5–6 explain how to compute emissions from *one source*. A **carbon footprint** adds many sources together for a person, company, product, city or country, and decides **where the boundary is drawn**.

### 7.1 GHG Protocol scopes (organisations)

| Scope | Definition | Examples | Typical equation |
| :-: | :-- | :-- | :-- |
| **1** | **Direct** emissions from owned/controlled sources | Boilers, furnaces, company vehicles, process emissions (§5.11), fugitive leaks, refrigerant leaks | $\sum \text{AD}\times\text{EF}$ (§5.2–5.11) |
| **2** | **Indirect** emissions from purchased electricity, steam, heat, cooling | Office/factory electricity | $Q_{kWh}\times\text{EF}_{\text{grid}}$ (location- and market-based, §5.3) |
| **3** | **All other indirect** emissions in the value chain, **upstream and downstream** | Purchased goods, business travel, commuting, use of sold products, waste | See below |

**The 15 Scope-3 categories:** *Upstream* — (1) purchased goods and services; (2) capital goods; (3) fuel- and energy-related activities not in Scope 1/2; (4) upstream transportation and distribution; (5) waste generated in operations; (6) business travel; (7) employee commuting; (8) upstream leased assets. *Downstream* — (9) downstream transportation and distribution; (10) processing of sold products; (11) **use of sold products**; (12) end-of-life treatment of sold products; (13) downstream leased assets; (14) franchises; (15) investments.

**Why Scope 3 is usually the largest** (often 70–90 % of a company's footprint†): a car-maker's cars burn fuel for years (category 11); a retailer's emissions are mostly in the products it sells (category 1); a bank's are in its loans (category 15). One company's Scope 3 is another's Scope 1 — so company footprints **overlap and must not be added** across firms (Hertwich & Wood 2018 found global scope 3 sums exceed the world total for exactly this reason).

**Organisational boundary approaches:** *equity share* (emissions × ownership %), *financial control*, *operational control*. The chosen method must be applied consistently.

### 7.2 Calculation methods for Scope 3 (quality hierarchy)

| Method | Equation | Data quality | Use |
| :-- | :-- | :-: | :-- |
| **Supplier-specific** | $E=\text{Qty}\times\text{EF}_{\text{supplier}}$ | Highest | Actual supplier product footprints |
| **Hybrid** | supplier data + estimates for the gaps | High | |
| **Average-data (physical)** | $E=\text{Mass or units}\times\text{EF}_{\text{industry average}}$ | Medium | Typical LCA database factors (e.g. kg CO₂e per kg steel) |
| **Spend-based** | $E=\text{Spend (\$)}\times\text{EF}_{\$}$ | Lowest | Screening only; ignores supplier performance; sensitive to price changes and inflation |

*Spend-based pitfalls:* if a supplier raises its price 10 %, its "emissions" rise 10 % though nothing physical changed; a cleaner but pricier product looks *worse*. Use spend-based to find hotspots, then replace with physical data where it matters.

### 7.3 Environmentally extended input-output (EEIO) analysis

The economy is a web: making cars needs steel, which needs electricity, which needs coal. **Leontief's input–output model** captures all these indirect links:

$$
\mathbf{x}=(\mathbf{I}-\mathbf{A})^{-1}\mathbf{y}\qquad\Rightarrow\qquad
\boxed{\;\mathbf{E}_{\text{footprint}}=\mathbf{f}\,(\mathbf{I}-\mathbf{A})^{-1}\,\mathbf{y}\;}
$$

- **A** = technical-coefficient matrix: $A_{ij}$ = money-value of inputs from sector $i$ needed per unit output of sector $j$.
- **y** = final demand (what consumers, governments and exports buy).
- **x** = total output of every sector needed to satisfy **y** (including supplying each other).
- **f** = direct emission intensity per unit of sector output (kg CO₂e per $).
- $(\mathbf{I}-\mathbf{A})^{-1}$ = the **Leontief inverse**, summing the infinite chain of indirect requirements ($\mathbf{I}+\mathbf{A}+\mathbf{A}^2+\dots$).

**Worked two-sector example** ✔ (computed): sector 1 = electricity and fuels, sector 2 = manufacturing.

$$
\mathbf{A}=\begin{pmatrix}0.05&0.25\\0.02&0.20\end{pmatrix},\quad
\mathbf{f}=\begin{pmatrix}2.0\\0.3\end{pmatrix}\ \text{kg CO}_2/\$,\quad
(\mathbf{I}-\mathbf{A})^{-1}=\begin{pmatrix}1.0596&0.3311\\0.0265&1.2583\end{pmatrix}
$$

Per **$1 of final demand for manufactured goods** ($\mathbf{y}=(0,1)^T$): sector outputs required $\mathbf{x}=(0.331,\ 1.258)$ $\Rightarrow$ footprint $=2.0\times0.331+0.3\times1.258=\mathbf{1.04\ kg\ CO_2}$ — **3.5× the manufacturer's own direct 0.30**: **71 %** of the footprint is in the supply chain (mostly electricity). A "clean-looking" manufacturing sector can carry a very dirty hidden footprint.

*Multi-regional* EEIO models (EXIOBASE, GTAP-MRIO, Eora) add trade between countries, giving **consumption-based national footprints** (§6.5) and the sector-level scope 1/2/3 analysis of Hertwich & Wood (2018).

### 7.4 Life Cycle Assessment (LCA) — products

Standards: **ISO 14040/14044** (LCA framework), **ISO 14067** (carbon footprint of products), **GHG Protocol Product Standard**, **PAS 2050**.

**Four phases:** (1) **goal and scope** — define the **functional unit** (e.g. "1 kg of bread", "1 km driven", "heating 100 m² for 1 year") and **system boundary** (*cradle-to-gate* = to the factory gate; *cradle-to-grave* = to disposal); (2) **inventory (LCI)** — list all inputs and outputs for each process; (3) **impact assessment (LCIA)** — convert emissions to CO₂e with GWPs; (4) **interpretation** — find hotspots, test sensitivity.

**Matrix formulation (process-based LCA):**

$$
\mathbf{A}_{\text{tech}}\,\mathbf{s}=\mathbf{f}_d,\qquad
\mathbf{g}=\mathbf{B}\,\mathbf{s},\qquad
\mathbf{h}=\mathbf{Q}\,\mathbf{g}
$$

$\mathbf{A}_{tech}$ = technology matrix (each column a process, linking inputs and outputs), $\mathbf{f}_d$ = demand vector (the functional unit), $\mathbf{s}$ = **scaling vector** (how many "runs" of each process are needed), $\mathbf{B}$ = environmental interventions (kg gas per process run), $\mathbf{g}$ = total inventory of emissions, $\mathbf{Q}$ = characterisation factors (GWPs), $\mathbf{h}$ = impact (kg CO₂e). It is the process-level twin of the EEIO equation above.

**Life-cycle total for a product:**

$$
E_{\text{LC}}=E_{\text{raw materials}}+E_{\text{manufacturing}}+E_{\text{distribution}}+E_{\text{use}}+E_{\text{end-of-life}}
$$

**Allocation problem:** when a process makes multiple products (e.g. a dairy cow gives milk and meat; a refinery gives petrol and diesel), emissions must be split between them by **physical** (mass, energy) or **economic** (revenue) allocation, or avoided by **system expansion** (crediting the displaced product). Different rules give different footprints — a leading reason numbers for the "same" product differ between studies.

**Also decide:** biogenic carbon treatment (§5.12), **land-use change** attribution (e.g. for soy, palm oil, beef), capital-goods inclusion, and temporal boundary.

### 7.5 Worked product comparison: electric vs petrol car (lifecycle use-phase break-even)

Use-phase emission rates ✔ (computed):

- **Petrol car:** 7.0 L/100 km × 2.27 kg CO₂/L = **159 g CO₂/km** (tailpipe; add ≈ 15–20 % for fuel supply chain†).
- **Electric car:** $e=\dfrac{0.18\ \text{kWh/km}\times\text{EF}_{\text{grid}}}{1-0.10}$

| Grid factor (g CO₂/kWh) | EV use-phase (g/km) | Petrol car (g/km) | EV extra manufacturing break-even* |
| :-: | :-: | :-: | :-: |
| 100 (very clean) | **20** | 159 | 6,000 kg ÷ (159−20) ≈ **43,000 km** |
| 400 (mixed) | **80** | 159 | 6,000 kg ÷ (159−80) ≈ **76,000 km** |
| 800 (coal-heavy) | **160** | 159 | **never** (equal/worse in use) |

*Assuming the EV's battery adds an illustrative **6 t CO₂** of manufacturing versus the petrol car†; the figure varies widely with battery size, factory electricity and cell chemistry. Formula:

$$
d^{*}=\frac{\Delta E_{\text{mfg}}}{e_{\text{ICE}}-e_{\text{EV}}}
$$

Conclusion (typical in published LCAs†): EVs win on most grids over a lifetime of 150,000+ km, by a wide margin on clean grids, narrowly on coal-heavy ones — and the **grid factor** you plug in is the dominant uncertainty.

### 7.6 Personal and household footprint

$$
E_{\text{person}}=E_{\text{home energy}}+E_{\text{transport}}+E_{\text{food}}+E_{\text{goods and services}}+E_{\text{public share}}
$$

Each term is an activity × factor (§5): kWh × grid EF; litres × 2.27/2.68; flight km × kg/pkm; food by LCA factors (§5.4–5.7); goods by spend-based or LCA factors; *public share* = per-capita share of government and infrastructure emissions. Bottom-up consumption footprints are typically within a factor of two of top-down national averages; large differences arise between income groups (the richest 10 % cause roughly half of emissions†). The uploaded primer's illustrative budget target is ≈ 2 t CO₂e per person by 2050†, against ≈ 4.7 t CO₂ (fossil only) and ≈ 6–7 t CO₂e (all gases) global per-capita averages today†.

---

## 8. Reduction mathematics and policy mathematics

### 8.1 Reduction arithmetic

**Percentage reduction and decomposition.** From the Kaya identity (§1), a change in emissions is the product of changes in each factor:

$$
\frac{F_2}{F_1}=\frac{P_2}{P_1}\cdot\frac{(\text{GDP}/P)_2}{(\text{GDP}/P)_1}\cdot\frac{(E/\text{GDP})_2}{(E/\text{GDP})_1}\cdot\frac{(F/E)_2}{(F/E)_1}
$$

Example: efficiency −20 % (×0.8) and clean-up of energy −30 % (×0.7) give $0.8\times0.7=0.56$ → **−44 %** (matches §1).

**Heating efficiency (insulation).** Heat lost through a surface: $Q=U\,A\,\Delta T$ (U in W m⁻² K⁻¹, A in m², ΔT in K). Over a season, using **heating degree days (HDD)**: $Q_{\text{kWh}}=U\,A\cdot\text{HDD}\cdot24/1000$.

Example ✔ (computed): upgrading 100 m² of wall from U = 1.5 to 0.3 in a climate with 2,500 HDD saves $(1.5-0.3)\times100\times2500\times24/1000=7{,}200$ kWh of heat per year; with a 90 %-efficient gas boiler (224 g CO₂/kWh_th, §5.3): $7{,}200\times0.224=\mathbf{1.6\ t\ CO_2/yr}$ saved.

**Lighting.** Replacing a 60 W incandescent with a 10 W LED for 1,000 h/yr saves 50 kWh/yr = **20 kg CO₂/yr** at 0.4 kg/kWh (✔ computed).

**Heat pumps and EVs:** §5.3 and §7.5. **Diet and land:** §5.4–5.7 give the farm-level numbers; the dominant effect of diet is through methane (cattle) and land-use change (pasture/feed crops), so *replacing a kg of beef with a legume* reduces emissions by an order of magnitude in LCA studies†.

### 8.2 Marginal abatement cost (MAC)

$$
\text{MAC}=\frac{C_{\text{alt}}-C_{\text{base}}}{E_{\text{base}}-E_{\text{alt}}}\qquad[\$/\text{tCO}_2\text{e}]
$$

(Annualised cost difference divided by annual emissions avoided.) Negative MAC means the measure *saves money* (e.g. many efficiency measures, leak repair of saleable gas). Ranking measures by MAC gives a **marginal abatement cost curve**; the width of each bar is its abatement potential.

### 8.3 Carbon pricing: what a price does to fuel and energy costs

A carbon price $P_C$ (\$/t CO₂) raises the cost of a fuel by $P_C\times\text{EF}$. At **$100/t CO₂** ✔ (computed):

| Fuel | Extra cost |
| :-- | :-: |
| Gasoline (2.27 kg CO₂/L) | **$0.227/L** |
| Diesel (2.68 kg CO₂/L) | **$0.268/L** |
| Natural gas (0.0561 t CO₂/GJ) | **$5.61/GJ** |
| Bituminous coal (2.44 t CO₂/t) | **$244/t coal** |

- **Carbon tax:** fixes the **price**, lets quantity vary.
- **Emissions trading system (ETS) — cap and trade:** fixes the **quantity**, lets price vary; the cap declines linearly: $\text{Cap}_t=\text{Cap}_{t_0}-\text{LRF}\cdot(t-t_0)$ (linear reduction factor; the EU ETS uses ≈ 4.3 %/yr for 2024–2027 and ≈ 4.4 % from 2028†).
- **Border carbon adjustment (e.g. EU CBAM):** importers pay (roughly) the difference between the domestic carbon price and any carbon price already paid abroad, on the *embedded emissions* of covered goods (steel, cement, aluminium, fertiliser, electricity, hydrogen): $\text{Charge}\approx E_{\text{embedded}}\times\big(P_{\text{EU}}-P_{\text{paid abroad}}\big)$, adjusted for free allocation†. Its definitive phase began in 2026†.
- **Mandatory disclosure and standards** (building codes, vehicle CO₂ standards, methane regulations on oil and gas) work where prices alone are politically hard.

### 8.4 Social cost of carbon (SCC)

The SCC is the present value of the damage caused by one extra tonne of CO₂:

$$
\text{SCC}_t=\sum_{s\ge t}\frac{\partial D_s/\partial E_t}{(1+r)^{\,s-t}}
$$

$D_s$ = damages in year $s$, $E_t$ = emissions in year $t$, $r$ = **discount rate**, which dominates the answer: at a high rate, distant damages shrink to nothing. The **Ramsey rule** gives a consumption discount rate $r=\rho+\eta g$ (pure time preference $\rho$, elasticity of marginal utility $\eta$, per-capita growth $g$)†. Estimates range from tens to several hundred dollars per tonne; the US EPA (2023) proposed ≈ $190/tCO₂ (2020 dollars) at a 2 % discount rate†.

### 8.5 Carbon removal and "net zero"

$$
E_{\text{net}}=E_{\text{gross}}-R
$$

$R$ = *durable* removals. Net zero for **CO₂** means cumulative net emissions reach zero; because CO₂ is a stock gas (§3.9), the temperature stabilises soon after (zero-emissions commitment ≈ 0†). For a **basket of gases**, GWP-100 net zero and "temperature stabilisation" can differ because short-lived methane falls out of the atmosphere quickly (§4.4). Removal types differ in permanence: trees and soils (decades; reversible by fire, drought, harvest), biochar and enhanced weathering (centuries), direct air capture with geological storage (millennia but energy-hungry: roughly 1,500–2,500 kWh per tonne of CO₂ removed, depending on the technology†). **An offset is not a reduction:** it must be additional, measured, permanent and not double-counted; temporary storage is worth less than a tonne avoided because the same tonne can return to the air.

---

## 9. Impact equations

**Thermal expansion of seawater (one contribution to sea-level rise):**

$$
\Delta h=\alpha\,\Delta T\,H
$$

$\alpha$ = thermal expansion coefficient of seawater (≈ 1–3×10⁻⁴ K⁻¹ for the upper ocean, increasing with temperature†), $H$ = depth of the layer warmed. Example: 1 K of warming through the top 700 m with α = 1.5×10⁻⁴ gives $1.5\times10^{-4}\times700\times1\approx0.10$ m ✔ (computed). Ice melt adds more: the Greenland and Antarctic ice sheets hold the equivalent of ≈ 7.4 m and ≈ 58 m of sea level respectively†.

**Heavier rain from a warmer atmosphere:** the Clausius–Clapeyron relation (§2.5) gives ≈ **6.5 % more water vapour per kelvin** ✔ (computed), so the *maximum* rainfall intensity rises ≈ 6–7 % per K (the actual response varies with storm type†).

**Ocean acidification:**

$$
\text{pH}=-\log_{10}[\text{H}^{+}]\ \Rightarrow\ \Delta\text{pH}=-0.1\ \text{means}\ [\text{H}^+]\ \times10^{0.1}=1.26\ (\mathbf{+26\ \%})\ ✔
$$

Surface-ocean pH has fallen ≈ 0.1 unit (≈ 8.2 → 8.1; ≈ 26–30 % rise in [H⁺]†). Shell-building organisms need carbonate ions; the **saturation state** is

$$
\Omega=\frac{[\text{Ca}^{2+}][\text{CO}_3^{2-}]}{K'_{sp}}\qquad(\Omega<1:\ \text{shells tend to dissolve})
$$

Seawater's **Revelle factor** $R=\dfrac{\Delta[\text{CO}_2]/[\text{CO}_2]}{\Delta\text{DIC}/\text{DIC}}\approx8\text{–}15$† explains why the ocean takes up only a fraction of added CO₂: chemistry buffers dissolved CO₂ so that a 10 % rise in the atmosphere raises *total* dissolved carbon by only ≈ 1 %. Carbonate-ion buffering also falls as CO₂ rises, so uptake capacity declines.

**Heat stress:** risk depends on **wet-bulb temperature** (a combination of heat and humidity); humans cannot shed heat beyond ≈ 35 °C wet-bulb for long periods†. Other impacts and economic damage functions are covered in the uploaded primer; the physics here gives the drivers.

---

## 10. Uncertainty

Every number above has an uncertainty. IPCC good practice combines uncertainties for independent quantities:

**Product** (e.g. activity × emission factor), uncertainties as percentages:

$$
U_{\text{total}}=\sqrt{U_1^2+U_2^2+\dots+U_n^2}
$$

**Sum** (emissions $x_i$ with uncertainties $U_i$ added together):

$$
U_{\text{total}}=\frac{\sqrt{(U_1x_1)^2+(U_2x_2)^2+\dots+(U_nx_n)^2}}{\left|x_1+x_2+\dots+x_n\right|}
$$

**Example:** a cattle herd count known to ±5 % and an emission factor to ±30 % → $\sqrt{5^2+30^2}=30.4$ % — the factor dominates. A sum of two independent sources (100 ± 10 %, 50 ± 40 %): $\sqrt{(10)^2+(20)^2}/150=14.9$ % — the large, uncertain source matters most. **Tier 2 and Monte Carlo** methods sample the parameter ranges thousands of times when errors are non-normal or correlated.

**Typical uncertainties†:**

| Source / quantity | Typical uncertainty |
| :-- | :-: |
| Global fossil CO₂ | ≈ ±5–8 % |
| Land-use-change CO₂ | ≈ ±50 % |
| Total GHG (2018: 58 ± 6.1 GtCO₂e ✔; 2019: 59 ± 6.6†) | ≈ ±11 % |
| Enteric CH₄ (Tier 2) | ≈ ±20–30 % |
| Landfill CH₄ | ≈ ±30–50 % |
| Oil/gas and coal fugitive CH₄ | ≈ ±50–100 % (and probably biased low) |
| Soil N₂O: EF₁ range (0.3–3 % ✔; factor ≈ 3 in each direction) | ≈ −70 % / +200 % |
| GWP-100 of CH₄ (AR6: 27.0 ± 11; 29.8 ± 11 → ±40 %†) | ≈ ±40 % |
| Climate sensitivity (likely 2.5–4 °C) | ≈ −17 % / +33 % |

**Systematic errors** matter more than random ones: missed sources, super-emitters, boundary and double-counting mistakes, mixing GWP versions, and spending-based factors. The Global Methane Budget exposes this: bottom-up and top-down estimates differ by source even where totals agree.

---

## 11. Constants, conversions, common mistakes

### 11.1 Constants

| Constant | Value |
| :-- | :-- |
| Stefan–Boltzmann σ | 5.670374×10⁻⁸ W m⁻² K⁻⁴ ✔ |
| Solar constant S | 1361 W/m² ✔ |
| Planetary albedo | ≈ 0.30 |
| Effective radiating temperature | 254.6 K (−18.6 °C) ✔ |
| Mass of atmosphere | 5.148×10¹⁸ kg ✔ |
| Mean molar mass of dry air | 28.97 g/mol |
| Molar masses | C 12.011; H 1.008; N 14.007; O 15.999; CO₂ 44.01; CH₄ 16.04; N₂O 44.01; NH₃ 17.03; CaCO₃ 100.09; CaO 56.08 |
| Methane density (≈ 20 °C, 1 atm) | 0.67 kg/m³ ✔ |
| CH₄ energy content (gross used in enteric eq.) | 55.65 MJ/kg ✔ |
| CH₄ lower heating value | ≈ 50 MJ/kg |
| 1 ppm CO₂ | 2.134 GtC = 7.82 GtCO₂ ✔ |
| 1 ppb CH₄ | 2.85 Tg ✔ |
| 1 ppb N₂O | 7.82 Tg N₂O ✔ |
| Carbon fraction of dry biomass | 0.47† |

### 11.2 Conversions

| From → To | Factor |
| :-- | :-: |
| C → CO₂ | ×3.664 |
| N → N₂O | ×1.571 |
| C → CH₄ | ×1.336 |
| 1 kWh | 3.6 MJ |
| 1 GJ | 277.8 kWh |
| 1 tonne of oil equivalent (toe) | 41.868 GJ† |
| 1 US gallon | 3.785 L |
| 1 short ton | 0.9072 tonne |
| 1 Gg = 10³ t; 1 Tg = 10⁶ t; 1 Pg = 1 Gt = 10⁹ t | – |
| ppm → % | ÷ 10,000 |
| kg N₂O–N → kg N₂O | ×44/28 |

### 11.3 Common mistakes (and how to avoid them)

1. **Mixing GWP sets.** State AR5 vs AR6, and 20- vs 100-year. A 10–20 % swing is common.
2. **CO₂ vs C vs N₂O–N.** Remember 44/12 and 44/28. IPCC inventories report soil N₂O as N₂O–N.
3. **Double counting** scope 2/3 between companies or scope 3 categories.
4. **Treating biogenic CH₄ like CO₂.** Biogenic CO₂ may be excluded; biogenic CH₄ and N₂O never.
5. **Using spend-based factors for decisions** instead of screening.
6. **Forgetting upstream** (gas leakage, mining methane, fertiliser production, battery manufacture).
7. **Calling CO₂ "short-lived".** It is the opposite (§3.2). Methane is the short-lived one.
8. **Confusing the "ozone layer" with ozone as a greenhouse gas** (§3.6).
9. **Saying "methane is 28× CO₂" without the horizon or table.** It is ≈ 80× over 20 years, ≈ 27–30× over 100.
10. **Assuming biomass energy is automatically carbon-neutral** (§5.12).
11. **Ignoring non-CO₂ aviation effects** or applying one multiplier for all metrics (§5.13).
12. **Unit slips:** ppm vs ppb; Tg vs Gg; short vs metric tons; kWh_th vs kWh_e.
13. **Reporting a single number with no uncertainty or boundary.**

---

## 12. Reference calculators (Python)

The code below implements the key equations of this document. It is plain Python 3 (standard library only), and was tested: running it reproduces the worked examples. Save it as `calculators.py`.

```python
"""Reference calculators for the equations in this document (IPCC-style, simplified).
Run:  python calculators.py   -> prints a self-test that reproduces the worked examples."""
import math

# ---------- constants ----------
M_ATM = 5.148e18          # kg, mass of the atmosphere
M_AIR = 28.97             # g/mol, dry air
MOLAR = {"CO2": 44.01, "CH4": 16.04, "N2O": 44.013}
GWP100_AR6 = {"CO2": 1, "CH4_fossil": 29.8, "CH4_nonfossil": 27.0, "N2O": 273,
              "SF6": 25200, "NF3": 17400, "CF4": 7380, "C2F6": 12400,
              "HFC134a": 1526, "HFC32": 771, "HFC125": 3740}
GWP20_AR6 = {"CO2": 1, "CH4_fossil": 82.5, "CH4_nonfossil": 79.7, "N2O": 273}

def co2e(masses: dict, gwp: dict = GWP100_AR6) -> float:
    """CO2e = sum(mass_i * GWP_i). masses in any single mass unit."""
    return sum(m * gwp[g] for g, m in masses.items())

# ---------- conversions ----------
C_TO_CO2, N_TO_N2O = 44.01 / 12.011, 44.01 / 28.01
def ppm_to_gtco2(ppm): return ppm * (44.01 / M_AIR) * M_ATM * 1e-6 / 1e12   # Gt CO2 per ppm
def ppb_to_tg(ppb, gas): return ppb * (MOLAR[gas] / M_AIR) * M_ATM * 1e-9 / 1e9

# ---------- combustion ----------
def fuel_co2_kg(mass_t, ncv_gj_per_t, ef_kg_per_tj, oxidation=1.0):
    """IPCC Tier 1: kg CO2 = mass * NCV(GJ/t) / 1000 (TJ) * EF(kg/TJ)."""
    return mass_t * ncv_gj_per_t / 1000.0 * ef_kg_per_tj * oxidation

def liquid_fuel_co2_per_litre(density_kg_l, ncv_mj_kg, ef_g_mj): return density_kg_l * ncv_mj_kg * ef_g_mj / 1000.0

def plant_ef_g_per_kwh(fuel_ef_g_mj, efficiency): return fuel_ef_g_mj / efficiency * 3.6

# ---------- livestock ----------
def enteric_ef_tier2(ge_mj_day, ym_percent):             # kg CH4 / head / yr
    return ge_mj_day * (ym_percent / 100.0) * 365 / 55.65

def volatile_solids(ge, de_pct, ue=0.04, ash=0.08):      # kg VS / head / day
    return (ge * (1 - de_pct / 100.0) + ue * ge) * (1 - ash) / 18.45

def manure_ch4_ef(vs, bo, mcf_percent_by_system):         # kg CH4 / head / yr; dict {mcf%: fraction}
    return vs * 365 * bo * 0.67 * sum(m / 100.0 * f for m, f in mcf_percent_by_system.items())

# ---------- rice ----------
def rice_ch4_kg_per_ha(days, ef_c=1.30, sf_w=1.0, sf_p=1.0, roa_cfoa=0.0, sf_sr=1.0):
    sf_o = (1 + roa_cfoa) ** 0.59
    return ef_c * sf_w * sf_p * sf_o * sf_sr * days

# ---------- soils N2O ----------
def soil_n2o_kg(n_syn, ef1=0.01, frac_gasf=0.10, ef4=0.010, frac_leach=0.30, ef5=0.0075):
    """kg N2O from n_syn kg synthetic N (direct + volatilisation + leaching), IPCC Tier 1."""
    direct = n_syn * ef1
    vol = n_syn * frac_gasf * ef4
    leach = n_syn * frac_leach * ef5
    return (direct + vol + leach) * 44 / 28

# ---------- landfill (first-order decay) ----------
def landfill_ch4_by_year(w_t, doc, k, years=40, docf=0.5, mcf=1.0, f=0.5, ox=0.1, recovered=0.0):
    ddocm = w_t * doc * docf * mcf
    out, remaining = [], ddocm
    for _ in range(years):
        decomposed = remaining * (1 - math.exp(-k))
        remaining -= decomposed
        gen = decomposed * f * 16 / 12
        out.append((gen - recovered * gen) * (1 - ox))
    return out

# ---------- gas leakage ----------
def gas_footprint_g_per_mj(leak, gwp_ch4, lhv_mj_kg=50.0):
    burned = 1 / lhv_mj_kg                     # kg CH4 per MJ
    leaked = burned * leak / (1 - leak)
    return burned * 44.01 / 16.04 * 1000 + leaked * gwp_ch4 * 1000

# ---------- metrics: AGWP / GWP ----------
A0, AI, TAU = 0.2173, (0.2240, 0.2824, 0.2763), (394.4, 36.54, 4.304)
def irf_co2_integral(h): return A0 * h + sum(a * t * (1 - math.exp(-h / t)) for a, t in zip(AI, TAU))
def a_per_kg(re_per_ppb, molar): return re_per_ppb * (M_AIR / molar) * (1e9 / M_ATM)
def gwp_single_exp(re_per_ppb, molar, tau, h, enhancement=1.0, re_co2=1.37e-5):
    agwp_x = a_per_kg(re_per_ppb, molar) * enhancement * tau * (1 - math.exp(-h / tau))
    return agwp_x / (a_per_kg(re_co2, 44.01) * irf_co2_integral(h))

def gwp_star(e_now, e_prev, gwp_h, h=100, dt=20, r=0.75, s=0.25):
    return gwp_h * (r * (e_now - e_prev) / dt * h + s * e_now)

# ---------- radiative forcing (AR6 / Meinshausen 2020 simplified expressions) ----------
def sarf_co2(c, n, c0=278.3):
    a1, b1, c1, d1 = -2.4785e-7, 7.5906e-4, -2.1492e-3, 5.2488
    cmax = 277.15 - b1 / (2 * a1)
    ap = (d1 - b1**2 / (4 * a1)) if c > cmax else d1 + a1 * (c - c0) ** 2 + b1 * (c - c0)
    return (ap + c1 * math.sqrt(n)) * math.log(c / c0)
def sarf_ch4(m, n, m0=729.2):
    return (-8.9603e-5 * math.sqrt(m) - 1.2462e-4 * math.sqrt(n) + 0.045194) * (math.sqrt(m) - math.sqrt(m0))
def sarf_n2o(c, n, m, n0=270.1):
    return (-3.4197e-4 * math.sqrt(c) + 2.5455e-4 * math.sqrt(n) - 2.4357e-4 * math.sqrt(m) + 0.12173) * (math.sqrt(n) - math.sqrt(n0))
def myhre_co2(c, c0=280.0): return 5.35 * math.log(c / c0)

# ---------- carbon cycle ----------
def co2_pulse_fraction(t): return A0 + sum(a * math.exp(-t / tau) for a, tau in zip(AI, TAU))
def one_box(b0, emissions, tau, t): return emissions * tau + (b0 - emissions * tau) * math.exp(-t / tau)

if __name__ == "__main__":
    print("1 ppm CO2 =", round(ppm_to_gtco2(1), 2), "GtCO2 | 1 ppb CH4 =", round(ppb_to_tg(1, "CH4"), 2), "Tg")
    print("gasoline kg CO2/L:", round(liquid_fuel_co2_per_litre(0.74, 44.3, 69.3), 2), "| diesel:", round(liquid_fuel_co2_per_litre(0.84, 43.0, 74.1), 2))
    print("coal 1 t kg CO2:", round(fuel_co2_kg(1, 25.8, 94600)))
    print("CCGT g/kWh:", round(plant_ef_g_per_kwh(56.1, 0.55)), "| coal:", round(plant_ef_g_per_kwh(94.6, 0.34)))
    print("enteric EF (GE=300, Ym=5.7):", round(enteric_ef_tier2(300, 5.7), 1), "kg/yr")
    vs = volatile_solids(300, 65); print("VS:", round(vs, 2), "| lagoon 70% EF:", round(manure_ch4_ef(vs, 0.24, {70: 1.0}), 1))
    print("rice continuous / AWD(0.52):", round(rice_ch4_kg_per_ha(100, sf_w=1.0, roa_cfoa=4)), round(rice_ch4_kg_per_ha(100, sf_w=0.52, roa_cfoa=4)))
    n2o06 = soil_n2o_kg(100); n2o19 = soil_n2o_kg(100, 0.016, 0.11, 0.014, 0.24, 0.011)
    print("100 kg N -> N2O kg (2006, 2019 wet):", round(n2o06, 2), round(n2o19, 2), "| CO2e:", round(n2o06 * 273), round(n2o19 * 273))
    ch4 = landfill_ch4_by_year(1000, 0.15, 0.185); print("landfill: yr1", round(ch4[0], 1), "cum40", round(sum(ch4), 1), "t CH4")
    print("gas leak 2%: g CO2e/MJ GWP100 / GWP20:", round(gas_footprint_g_per_mj(0.02, 29.8), 1), round(gas_footprint_g_per_mj(0.02, 82.5), 1))
    print("GWP20/100 CH4 (AR5 style):", round(gwp_single_exp(3.63e-4, 16.04, 12.4, 20, 1.65), 1), round(gwp_single_exp(3.63e-4, 16.04, 12.4, 100, 1.65), 1))
    print("GWP-star example:", round(gwp_star(90, 100, 29.8)), " | constant:", round(gwp_star(100, 100, 29.8)))
    print("SARF 2019 (CO2, CH4, N2O):", round(sarf_co2(409.9, 332.1), 2), round(sarf_ch4(1866.3, 332.1), 2), round(sarf_n2o(409.9, 332.1, 1866.3), 3))
    print("CO2 pulse fraction at 100 / 1000 yr:", round(co2_pulse_fraction(100), 3), round(co2_pulse_fraction(1000), 3))
    print("CH4 one-box after 45% cut, 10 yr (ppb):", round(one_box(5232, 409, 9.1, 10) / 2.85))
    print("R-410A blend GWP:", co2e({"HFC32": 0.5, "HFC125": 0.5}))
```

Running the file prints a self-test that reproduces the worked examples in this document (e.g. gasoline 2.27 kg/L, diesel 2.68 kg/L, enteric EF 112.2, rice 336 → 175 kg CH₄/ha, soil N₂O 2.08 vs 3.17 kg, landfill 45.0 t CH₄, GWP-20/100 of CH₄ 83.6/28.4, GWP\* 745 and −447, AR6 SARF 2.05/0.63/0.195 W/m², CO₂ pulse fraction 0.409 at 100 years).

---

## 13. Verification log and references

### 13.1 What was verified, and against what

| Item | Status | Checked against |
| :-- | :-: | :-- |
| Etminan 2016 forcing formulas, all coefficients, validity ranges, 0.48→0.61 W/m², 28→32 GWP, 10 % at 2000 ppm | ✔ | Full text of the paper (*Geophys. Res. Lett.* 43, 12,614) |
| AR6 / Meinshausen 2020 formula coefficients, 1750 baselines (278.3 ppm, 729.2 ppb, 270.1 ppb), F₂ₓ = 3.93 W/m², λ = −1.31 W m⁻² K⁻¹ | ✔ | IPCC AR6 WGI Chapter 7 *Supplementary Material* (and numerically reproduced AR6's ERFs) |
| AR6 ERFs 1750→2019 (2.16, 0.54, 0.21, 0.41, 0.47, −1.3, 2.72 W/m²) and 2019 concentrations | ✔ | AR6 WGI Chapter 7 summary tables (Table 7.8) as reproduced by IPCC data portals |
| 2024 concentrations (CO₂ 423.9 ppm, CH₄ 1942 ppb, N₂O 338.0 ppb); N₂O ≈ +24 % over 270 ppb; CO₂ ≈ 60 % / CH₄ ≈ 20 % of GHG forcing; Mauna Loa June 2026 = 431.4 ppm | ✔ | WMO Greenhouse Gas Bulletin No. 21; NOAA Global Monitoring Laboratory |
| AR6 GWP-100: CH₄ 27.0 / 29.8, N₂O 273, SF₆ 25,200, NF₃ 17,400, CF₄ 7,380, C₂F₆ 12,400, HFC-134a 1,526, HFC-32 771 | ✔ (main values) | GHG Protocol AR6 table; Table 7.15/7.SM.7 via secondary compilations. *Small differences exist between compilations (CH₄ non-fossil 27.0 vs 27.9; GWP-20 79.7 vs 80.8 vs 81.2).* |
| CH₄ GWP-20: 82.5 fossil, 79.7 microbial | ✔ | Saunois et al. 2025 |
| Tier-2 enteric equation EF = GE·Yₘ·365/55.65; GE structure (Eq 10.16); Yₘ = 6.5 %, 3.0 % feedlot | ✔ | IPCC 2006 Vol 4 Ch 10 and associated inventory worked examples |
| Manure CH₄ Tier-2 (Eq 10.23), VS (Eq 10.24), N₂O (Eq 10.25) structure | ✔ | IPCC 2006 Vol 4 Ch 10 excerpts |
| Rice: EF structure, EF_c = 1.30 (2006) / 1.19 (2019), SF_w values (1.0, 0.60, 0.52) | ✔ | IPCC 2006 Vol 4 Ch 5 as cited by UNFCCC methodology; Wang et al. 2018 (*Atmos. Chem. Phys.* 18, 10419) |
| Soil N₂O: EF₁ = 0.01 (0.003–0.03) in 2006; 0.016 / 0.005 / 0.006 in 2019; EF₅ = 0.011; Frac_LEACH 0.24 | ✔ | Open-access papers on the 2019 Refinement EF₁ update (PMC9293294, CIFOR) |
| Landfill FOD equations; DOC_f = 0.5, F = 0.5, OX = 0.1, MCF values | ✔ | IPCC 2006 Vol 5 Ch 3 |
| Fuel NCV and CO₂ EF (gasoline, diesel, natural gas, bituminous coal) | ✔ | IPCC 2006 Vol 2 Ch 1 tables as reproduced in UN and regulatory documents |
| Global methane budget (575 Tg, 65 % human, 228/115/27, 248, 563, 608, 1,912 ppb, 1.19/3.84 W/m²) | ✔ | Saunois et al. 2025, *Earth Syst. Sci. Data* 17, 1873 |
| Remaining 1.5 °C budget ≈ 130 GtCO₂ from 2026; ≈ 42 GtCO₂/yr; warming rate 0.27 °C/decade | ✔ | Indicators of Global Climate Change (Forster et al.) 2025 update |
| GWP\* parameters r = 0.75, s = 0.25, Δt = 20 yr | ✔ | Cain et al. 2019; Smith et al. 2021 |
| CO₂ impulse-response coefficients and AGWP values (9.17×10⁻¹⁴, 2.49×10⁻¹⁴) | ✔ | Reproduced by calculation (matches AR5 values) |
| **All worked numerical examples** | ✔ | Recomputed in Python (§12) |
| Items marked **†** | ⚠ | Recalled standard values; verify before formal use |

### 13.2 Notes on the earlier primer you uploaded

- The **diesel factor** of 5.83 kg CO₂/L is a typo; the correct value is ≈ 2.68 (§5.2).
- A **0.1 pH-unit fall** is a **+26 %** increase in [H⁺] (10^0.1), commonly rounded to "about 30 %" for a ≈ 0.11 fall (§9).
- State the **GWP set** (AR5 vs AR6) everywhere; the primer mixes ranges (§4.2).
- The "**Gutowski 8.5 t**" figure is an MIT class project presented at an engineering conference, not an *Environmental Science & Technology* paper; treat as illustrative.
- Current CO₂ is ≈ **426 ppm** (2025 global mean) and ≈ 431 ppm at Mauna Loa in mid-2026, not "about 420".

### 13.3 References

**Radiation and forcing**
- Etminan, M., Myhre, G., Highwood, E. J., Shine, K. P. (2016). Radiative forcing of carbon dioxide, methane, and nitrous oxide: A significant revision of the methane radiative forcing. *Geophysical Research Letters* 43(24), 12,614–12,623. https://doi.org/10.1002/2016GL071930
- Meinshausen, M., et al. (2020). The shared socio-economic pathway (SSP) greenhouse gas concentrations and their extensions to 2500. *Geoscientific Model Development* 13, 3571–3605.†
- Forster, P., Storelvmo, T., et al. (2021). The Earth's energy budget, climate feedbacks, and climate sensitivity. In *IPCC AR6 WGI*, Chapter 7, and Supplementary Material. https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_FGD_Chapter07_SM.pdf
- Myhre, G., Highwood, E. J., Shine, K. P., Stordal, F. (1998). New estimates of radiative forcing due to well-mixed greenhouse gases. *Geophysical Research Letters* 25(14), 2715–2718.†
- Joos, F., et al. (2013). Carbon dioxide and climate impulse response functions for the computation of greenhouse gas metrics. *Atmospheric Chemistry and Physics* 13, 2793–2825.†

**Metrics**
- Cain, M., et al. (2019). Improved calculation of warming-equivalent emissions for short-lived climate pollutants. *npj Climate and Atmospheric Science* 2, 29.†
- Smith, M. A., Cain, M., Allen, M. R. (2021). Further improvement of warming-equivalent emissions calculation. *npj Climate and Atmospheric Science* 4.†
- Lee, D. S., et al. (2021). The contribution of global aviation to anthropogenic climate forcing for 2000 to 2018. *Atmospheric Environment* 244, 117834.†

**Budgets and concentrations**
- Saunois, M., et al. (2025). Global Methane Budget 2000–2020. *Earth System Science Data* 17, 1873. https://essd.copernicus.org/articles/17/1873/2025/
- Forster, P. M., et al. Indicators of Global Climate Change 2025. *Earth System Science Data* 18, 3889 (2026); https://indicators.climate.copernicus.eu/
- WMO (2025). *Greenhouse Gas Bulletin No. 21*; NOAA Global Monitoring Laboratory, https://gml.noaa.gov/ccgg/trends/
- Minx, J. C., et al. (2021). A comprehensive and synthetic dataset for global, regional and national greenhouse gas emissions by sector 1970–2018. *Earth System Science Data* 13, 5213.†
- UNEP/CCAC (2021). *Global Methane Assessment*.†

**Inventory methods**
- IPCC (2006). *Guidelines for National Greenhouse Gas Inventories*, Vol 2 (Energy), Vol 3 (IPPU), Vol 4 (AFOLU), Vol 5 (Waste). https://www.ipcc-nggip.iges.or.jp/ — e.g. https://www.ipcc-nggip.iges.or.jp/public/2006gl/pdf/4_Volume4/V4_10_Ch10_Livestock.pdf and https://www.ipcc-nggip.iges.or.jp/public/2006gl/pdf/5_Volume5/V5_3_Ch3_SWDS.pdf
- IPCC (2019). *2019 Refinement to the 2006 Guidelines*. https://www.ipcc-nggip.iges.or.jp/public/2019rf/
- Wang, J., et al. (2018). Controlling variables and emission factors of methane from global rice fields. *Atmospheric Chemistry and Physics* 18, 10419–10431. https://acp.copernicus.org/articles/18/10419/2018/
- Hergoualc'h, K., et al. (2021). Improved accuracy and reduced uncertainty in greenhouse gas inventories by refining the IPCC emission factor for direct N₂O emissions from nitrogen inputs to managed soils. *Global Change Biology*. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9293294/
- WRI/WBCSD. *GHG Protocol Corporate Accounting and Reporting Standard*; *Scope 2 Guidance* (2015); *Scope 3 Standard* (2011); *Product Standard*.†
- ISO 14040/14044 (LCA); ISO 14067 (product carbon footprint).†
- IMO MEPC.308(73) (2018), guidelines on fuel carbon factors.†
- Schlömer, S., et al. (2014). Annex III: Technology-specific cost and performance parameters. *IPCC AR5 WGIII* (lifecycle electricity medians).†

**Ozone**
- Chapman, S. (1930). A theory of upper-atmospheric ozone. *Mem. R. Meteorol. Soc.* 3, 103.†
- Molina, M. J., Rowland, F. S. (1974). Stratospheric sink for chlorofluoromethanes. *Nature* 249, 810–812.†
- Ravishankara, A. R., Daniel, J. S., Portmann, R. W. (2009). Nitrous oxide (N₂O): the dominant ozone-depleting substance emitted in the 21st century. *Science* 326, 123–125.†
- Velders, G. J. M., et al. (2007). The importance of the Montreal Protocol in protecting climate. *PNAS* 104, 4814–4819.†
- WMO/UNEP (2022). *Scientific Assessment of Ozone Depletion*.†

**Footprints and responsibility**
- Poore, J., Nemecek, T. (2018). *Science* 360(6392), 987–992. https://doi.org/10.1126/science.aaq0216
- Hertwich, E. G., Wood, R. (2018). *Environmental Research Letters* 13(10), 104013. https://doi.org/10.1088/1748-9326/aae19a
- Lamb, W. F., et al. (2021). *Environmental Research Letters* 16(7), 073005. https://doi.org/10.1088/1748-9326/abee4e
- Wynes, S., Nicholas, K. A. (2017). *Environmental Research Letters* 12(7), 074024. https://doi.org/10.1088/1748-9326/aa7541

---

## 14. Glossary

| Term | Meaning |
| :-- | :-- |
| **Activity data (AD)** | Quantity of an activity: litres of fuel, head of cattle, hectares, tonnes of waste, kWh. |
| **AFOLU** | Agriculture, Forestry and Other Land Use — the land sector in inventories. |
| **AGWP** | *Absolute* global warming potential: energy added per m² by a 1 kg pulse, integrated over a horizon (W m⁻² yr kg⁻¹). |
| **Albedo** | Fraction of sunlight reflected (Earth ≈ 0.30). |
| **Anaerobic** | Without oxygen; where methane is produced. |
| **Anthropogenic** | Human-caused. |
| **Atmospheric window** | Wavelengths (≈ 8–13 µm) where the atmosphere is mostly transparent to infrared. |
| **Black carbon** | Soot; absorbs sunlight; short-lived warming agent. |
| **Bottom-up / top-down** | Inventory-and-model estimate / atmospheric-measurement-and-inversion estimate. |
| **Calcination** | Heating a carbonate so it releases CO₂ (CaCO₃ → CaO + CO₂). |
| **Carbon budget** | Cumulative CO₂ that can be emitted before a temperature threshold is passed. |
| **CFC / HCFC / HFC / PFC** | Chloro-/hydrochloro-/hydro-/per-fluorocarbons; ozone-depleting (CFC, HCFC) and/or potent greenhouse gases. |
| **CO₂e** | CO₂-equivalent: other gases converted using GWPs. |
| **DE (digestibility)** | Percentage of feed energy that the animal digests. |
| **Denitrification / Nitrification** | Microbial conversion of nitrate to N₂ (with N₂O leak) / ammonium to nitrate (with N₂O leak). |
| **Dobson unit (DU)** | Unit of ozone column thickness (0.01 mm at standard conditions). |
| **DOC / DOC_f / MCF / OX** | Degradable organic carbon / fraction decomposing / methane correction factor / oxidation in cover soil. |
| **ECS / TCR / TCRE** | Equilibrium climate sensitivity / transient climate response / transient response to cumulative emissions. |
| **EF (emission factor)** | Mass of gas emitted per unit of activity. |
| **ERF / SARF / RF** | Effective / stratospheric-adjusted / instantaneous radiative forcing. |
| **Eructation** | Belching; the main route of enteric methane release. |
| **FOD** | First-order decay model of waste breakdown. |
| **F-gases** | Fluorinated gases (HFCs, PFCs, SF₆, NF₃). |
| **GE (gross energy)** | Total energy in the feed an animal eats. |
| **GTP** | Global temperature change potential. |
| **GWP / GWP\*** | Global warming potential / its flow-based variant for short-lived gases. |
| **Hydroxyl radical (OH)** | Highly reactive molecule that destroys methane and other trace gases ("atmospheric detergent"). |
| **IPCC** | Intergovernmental Panel on Climate Change. |
| **IRF** | Impulse-response function: fraction of a pulse remaining over time. |
| **Kaya identity** | Emissions = population × affluence × energy intensity × carbon intensity. |
| **Lapse rate** | Rate at which temperature falls with altitude (≈ 6.5 K/km). |
| **LCA** | Life cycle assessment. |
| **Methanogens** | Archaea that make methane. |
| **NCV** | Net calorific value (lower heating value) of a fuel. |
| **ODS** | Ozone-depleting substance. |
| **Oxidation factor (OF)** | Fraction of fuel carbon actually oxidised to CO₂. |
| **Radiative efficiency (RE)** | Forcing per unit concentration of a gas (W m⁻² ppb⁻¹). |
| **Rumen** | First stomach chamber of ruminants, where fermentation occurs. |
| **Scope 1/2/3** | Direct / purchased-energy / value-chain emissions. |
| **SLCP / SLCF** | Short-lived climate pollutant/forcer (methane, tropospheric ozone, black carbon, HFCs). |
| **Tier 1/2/3** | IPCC method levels of increasing detail. |
| **TOA** | Top of atmosphere. |
| **VS** | Volatile solids: organic matter in manure that can ferment. |
| **Yₘ** | Percentage of feed gross energy converted to methane in an animal. |

---

*End of document. Equations are simplified representations of IPCC methods for learning and screening; formal inventories and corporate disclosures should use the full guideline text and current published factors.*
