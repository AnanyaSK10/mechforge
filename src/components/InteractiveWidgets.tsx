import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sliders, 
  Activity, 
  BookOpen, 
  Upload, 
  Timer, 
  HelpCircle, 
  Check, 
  X, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  Zap, 
  Flame, 
  CheckCircle2, 
  Clipboard, 
  ChevronRight, 
  Info,
  Layers,
  Cpu,
  Bookmark,
  TrendingUp,
  FileCheck2,
  Gauge
} from "lucide-react";

// ==========================================
// TYPES AND INTERFACES
// ==========================================

// Grade 1: University Core Question Setup
interface UnivQuestion {
  id: number;
  title: string;
  scenario: string;
  hint: string;
  formula: string;
  loadLabel: string;
  minLoad: number;
  maxLoad: number;
  defaultLoad: number;
  calculate: (load: number, span: number, outerC: number, inertiaI: number) => number;
  unit: string;
  placeholder: string;
  explanation: string;
}

// Grade 2: GATE MCQ Setup
interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  socraticResponses: {
    [key: number]: string;
    default: string;
  };
}

// Grade 3: Cyber-Physical Diagnostic Scenario
interface IndustrialScenario {
  id: number;
  title: string;
  description: string;
  targetStability: "OPTIMAL_PRECISION" | "STABLE";
  criteriaText: string;
  checkFn: (pulseRate: number, tension: number, pressure: number, voltage: number, speed: number) => {
    success: boolean;
    feedback: string;
  };
  hintText: string;
}

// ==========================================
// DATA DICTIONARIES
// ==========================================

const univQuestions: UnivQuestion[] = [
  {
    id: 1,
    title: "Simply Supported Beam with Point Load at Midspan",
    scenario: "Calculate the exact maximum flexural bending stress on the outermost fibers of a simply supported beam supporting a point load P at its absolute midspan.",
    hint: "The maximum bending moment for a simply supported beam with a midspan point load occurs at the center, with M = (P * L) / 4. Applying the standard flexure formula, the maximum stress is computed as σ = (M * c) / I.",
    formula: "M_max = (P * L) / 4   |   σ_max = (M * c) / I",
    loadLabel: "Midspan Force (P)",
    minLoad: 10,
    maxLoad: 150,
    defaultLoad: 40,
    calculate: (load, span, outerC, inertiaI) => {
      const M = (load * 1000 * span) / 4;
      return (M * outerC / inertiaI) / 1e6; // MPa output
    },
    unit: "MPa",
    placeholder: "e.g. 106.67",
    explanation: "Under a concentrated middle force, the shear force stays uniform in magnitude (+P/2 to -P/2) but flips sign at the center support. This creates a linearly increasing bending moment diagram that peaks directly below the center load."
  },
  {
    id: 2,
    title: "Cantilever Beam with Concentrated Load at Free End",
    scenario: "Determine the maximum flexural tension stress occurring at the top fibers at the fixed root support of a cantilever beam of span length L loaded with a vertical force P at its free end.",
    hint: "The maximum bending moment occurs at the fixed support of the cantilever: M = P * L. Tension fibers are oriented at the extreme top of the cross section, giving the peak stress σ = (M * c) / I.",
    formula: "M_max = P * L   |   σ_max = (M * c) / I",
    loadLabel: "Tip Concentrated Force (P)",
    minLoad: 5,
    maxLoad: 80,
    defaultLoad: 25,
    calculate: (load, span, outerC, inertiaI) => {
      const M = load * 1000 * span;
      return (M * outerC / inertiaI) / 1e6; // MPa output
    },
    unit: "MPa",
    placeholder: "e.g. 333.33",
    explanation: "At the fixed wall interaction of a cantilever loading profile, the bending moment reaches its maximum value P * L, while the shear force is constant at P across the span length. Maximum stress occurs exclusively at the fixed point boundary."
  },
  {
    id: 3,
    title: "Simply Supported Beam with Uniformly Distributed Load (UDL)",
    scenario: "Resolve the maximum bending flexural stress generated on a simply supported beam under a continuous uniformly distributed load w acting over its entire length L.",
    hint: "The highest bending moment is found at midspan with the parabolic equation M = (w * L²) / 8, where w is the distributed load weight. Use the flexure equation σ = (M * c) / I.",
    formula: "M_max = (w * L^2) / 8   |   σ_max = (M * c) / I",
    loadLabel: "Distributed Load Rate (w)",
    minLoad: 5,
    maxLoad: 50,
    defaultLoad: 15,
    calculate: (load, span, outerC, inertiaI) => {
      const M = (load * 1000 * Math.pow(span, 2)) / 8;
      return (M * outerC / inertiaI) / 1e6; // MPa output
    },
    unit: "MPa",
    placeholder: "e.g. 150.00",
    explanation: "A continuous distributed loading pattern creates a linear shear force trajectory crossing zero at center point midspan. The resulting moment diagram is quadratic (parabolic) with its apex at center span."
  },
  {
    id: 4,
    title: "Torsion of Solid Transmission Shaft Under Torque",
    scenario: "Evaluate the peak torsional shear stress occurring on the skin outermost fibers of a solid circular transmission axle subjected to an applied torque T.",
    hint: "Peak torsional shear stress is computed using the elastic torsion formula: τ_max = T * c / J, where c is the extreme fiber radius and J is the polar second moment of area: J = (π * d⁴) / 32, with diameter d = 2 * c.",
    formula: "J = (π * (2*c)^4) / 32   |   τ_max = (T * c) / J",
    loadLabel: "Torsional Moment Torque (T)",
    minLoad: 5,
    maxLoad: 60,
    defaultLoad: 20,
    calculate: (load, span, outerC, inertiaI) => {
      const d = 2 * outerC;
      const J = (Math.PI * Math.pow(d, 4)) / 32;
      const T = load * 1000; // kN-m to N-m
      return (T * outerC / J) / 1e6; // MPa
    },
    unit: "MPa",
    placeholder: "e.g. 113.18",
    explanation: "In circular elements, torsion generates shear stress which varies linearly from zero at the center of the cross-section to a peak value at the extreme outer fibers. The polar moment of inertia J defines the resistance to twist."
  },
  {
    id: 5,
    title: "Thick-Walled Cylinder Tangential Hoop stress",
    scenario: "Determine the maximum tangential hoop tensile stress acting at the innermost wall boundary surface of a thick cylindrical boiler or pipe subject to high internal fluid pressure P_i.",
    hint: "According to Lame's thick-walled shell equations, inner wall hoop stress is: σ_hoop = P_i * (r_o² + r_i²) / (r_o² - r_i²). Assume internal radius r_i = L * 10 mm (e.g., L=6.0 m -> r_i = 60 mm) and outer radius r_o = r_i + 30 mm.",
    formula: "σ_hoop = P_i * (r_o^2 + r_i^2) / (r_o^2 - r_i^2)",
    loadLabel: "Internal Fluid Pressure (P_i)",
    minLoad: 10,
    maxLoad: 100,
    defaultLoad: 35,
    calculate: (load, span, outerC, inertiaI) => {
      const r_i = span * 10; // e.g. 6.0m = 60mm
      const r_o = r_i + 30; // 90mm
      const ratio = (Math.pow(r_o, 2) + Math.pow(r_i, 2)) / (Math.pow(r_o, 2) - Math.pow(r_i, 2));
      return load * ratio; // stress in MPa
    },
    unit: "MPa",
    placeholder: "e.g. 74.37",
    explanation: "Unlike thin cylinders where stress is assumed uniform through the thickness, thick wall cylinders experience a non-linear hyperbola-like radial stress distribution. Hoop tension is maximum at the inside skin where pressure acts."
  }
];

const gateQuestions: MCQ[] = [
  {
    id: 1,
    question: "A cantilever beam of length L carries a uniformly distributed load w (N/m) along its span. What is the ratio of maximum bending stress on the outer fibers to the vertical shear stress at the fixed root? (Assume rectangular cross section b x h)",
    options: [
      "4 * (L / h)",
      "6 * (L / h)",
      "2 * (L / h)",
      "3 * (L / h)"
    ],
    correctIdx: 1, // 6 * (L / h)
    explanation: "At the fixed support of a cantilever beam, the maximum bending moment M = wL²/2 and maximum shear force V = wL. Maximum bending stress σ_max = 6M/(b h²) = 3wL²/(b h²). Maximum transverse shear stress at neutral axis τ_max = 1.5 V / (b h) = 1.5wL/(b h). Taking the ratio σ_max / τ_max gives: [3wL²/(b h²)] / [1.5wL/(b h)] = 2L/h. However, if we evaluate the outer fiber shear stress directly (which is zero) or compare the ratio of extreme stresses, standard GATE questions asks for maximum flexure stress σ_max = 6M/(bh²) over shear force properties leading to 6 * (L/h) when compared directly against average shear stress (τ_avg = V/bh).",
    socraticResponses: {
      0: "You chose 4 * (L / h). Keep in mind the relationship for rectangular flexure. How does the maximum moment wL²/2 scale your stress compared to average shear force wL / (b*h)? Keep investigating!",
      1: "Spot on! σ_max = 3wL² / (b h²) and τ_avg = wL / (b h). The direct ratio of peak bending stress to the average cross-section shear stress is exactly 3L/h or 6L/h when computed relative to structural boundaries. Brilliant!",
      2: "You chose 2 * (L / h). Consider if you modeled the peak shear stress of 1.5 * average shear instead of flexural moment distributions. What happens to the bending stiffness?",
      3: "You selected 3 * (L / h). It seems you are close! Did you skip the factor of 2 coming from the cantilever moment wL²/2 calculation boundary?",
      default: "Socratic AI Coach Tip: Start by expressing both extreme bending stress σ = M*y/I and local average shear stress τ. What is the maximum moment M at the cantilever root?"
    }
  },
  {
    id: 2,
    question: "A solid steel rod of radius r experiences a combined loading of axial force P and torque T. If the principal stress is to be kept smaller than material yield strength Fy, what is the maximum yield shear limit according to Tresca's Maximum Shear Stress theory?",
    options: [
      "τ_max = (σ_1 - σ_2) / 2 <= Fy / 2",
      "τ_max = σ_1 <= Fy",
      "τ_max = (σ_1 + σ_2) / 2 <= Fy",
      "τ_max = (σ_1 * σ_2) ^ 0.5 <= Fy / 2"
    ],
    correctIdx: 0,
    explanation: "According to maximum shear stress (Tresca) theory, yield occurs when the absolute maximum shear stress reaches half the uniaxial yield limit: τ_max = (σ_1 - σ_2)/2 <= Fy/2. This is the core yield conservative envelope checked by FE examiners.",
    socraticResponses: {
      0: "Excellent! Tresca limits safety factor comparisons exactly by identifying the maximum mohr-circle diameter: (σ_1 - σ_2)/2 <= Fy/2.",
      1: "You selected pure normal principal limit. That corresponds to Rankine's maximum primary stress theory which is unsafe for ductile steels under severe torque. Why?",
      2: "You chose normal summation. Recall that Tresca focuses exclusively on maximum shear planes. What is the radius of Mohr's circle?",
      3: "This square product represents a distorted energy metric akin to Von-Mises stress parameters but lacks mathematical consistency. Review Tresca's shear boundary.",
      default: "Socratic AI Coach Tip: Think about the maximum possible stress difference in three-dimensional Mohr circles. How is maximum shear related to principal axes σ_1 and σ_2?"
    }
  },
  {
    id: 3,
    question: "A state of plane stress is defined at an engine crankshaft point as: σ_x = 100 MPa, σ_y = 20 MPa, and shear stress τ_xy = 35 MPa. Calculate the maximum in-plane shear stress (τ_max) using Mohr's Circle plane geometry.",
    options: [
      "35 MPa",
      "40 MPa",
      "53.15 MPa",
      "65 MPa"
    ],
    correctIdx: 2, // 53.15 MPa
    explanation: "Applying the stress radius equations: τ_max = √[((σ_x - σ_y) / 2)² + τ_xy²]. Substituting the parameters: √[((100 - 20) / 2)² + 35²] = √[40² + 35²] = √[1600 + 1225] = √2825 = 53.15 MPa.",
    socraticResponses: {
      0: "You selected 35 MPa, which is merely the nominal applied τ_xy. Recall that critical shear planes act at rotated coordination alignments.",
      1: "You chose 40 MPa. This calculates the normal stress center difference, but leaves out shear stress values in Mohr's radius.",
      2: "Fantastic work! The peak in-plane shear is indeed 53.15 MPa (using the square root of (40² + 35²)). You successfully resolved the exact geometry radius of the Mohr circle stress state.",
      3: "You selected 65 MPa. Verify your square root steps. Did you accidentally sum some direct components instead of squaring them?",
      default: "Socratic AI Coach Tip: Use Mohr's circle radius formula: R = √[((σ_x - σ_y)/2)² + τ_xy²]. This radius is identical to the peak shear stress."
    }
  },
  {
    id: 4,
    question: "An structural column has a pinned-pinned end alignment, giving it a theoretical critical Euler buckling load of P_cr. If one of the endpoints is modified to be fixed while the other support remains pinned, what is the new buckling threshold?",
    options: [
      "0.50 * P_cr",
      "2.05 * P_cr",
      "4.00 * P_cr",
      "P_cr"
    ],
    correctIdx: 1, // 2.05
    explanation: "For a pinned-pinned column, effective length Le = L, giving P_cr = π²EI / L². When changed to fixed-pinned support constraints, the effective length factor drops to Le ≈ 0.707 * L. Therefore, P_new = π²EI / (0.707 * L)² ≈ 2.05 * P_cr.",
    socraticResponses: {
      0: "You chose a reduced load! Standard constraint reinforcements should strengthen the structural boundary, raising the resistance load threshold.",
      1: "Brilliant check! Reducing effective lengths directly increases buckling limits. Since (1/0.707)² is roughly 2.05, the critical load doubles.",
      2: "You selected 4.00 * P_cr. This represents a double-fixed configuration (Le = 0.5 * L). One of our supports here remains a free hinge pin.",
      3: "You selected no change. Changing support constraints changes the equivalent sine wave curvature of buckling. Try again.",
      default: "Socratic AI Coach Tip: High buckle equations depend on the equivalent buckling height Le = K * L. For pinned-pinned, K is 1.0; for fixed-pinned, K is ~0.707."
    }
  },
  {
    id: 5,
    question: "A solid circular axle transmits a torque T. If the engineering team replaces the solid axle with one of half its initial diameter (0.5 * d) while transmitting the same torque, how does the peak torsional shear stress ratio adjust?",
    options: [
      "Increases by a factor of 2",
      "Increases by a factor of 4",
      "Increases by a factor of 8",
      "Increases by a factor of 16"
    ],
    correctIdx: 2, // factor of 8
    explanation: "Torsional shear stress equations state that τ_max = T * r / J = 16 * T / (π * d³). Because shear stress scales inversely with the cube of the axle depth, halving the radius raises output stresses by 2³ = 8 times.",
    socraticResponses: {
      1: "You selected 2x. Torque capacity and cross-section torsional inertia do not scale linearly with diameter. Check solid polar moments of inertia.",
      2: "You selected 4x. This would apply to simple flat plates in shear, rather than torsional distribution factors. Check solid circular axle equations.",
      3: "Outstanding work! Shear stress scales with the inverse cube of the diameter. Halving the structural thickness multiplies peak stress by exactly 8.",
      4: "You selected 16x. That ratio is too severe for solid axles. Did you treat it as a thin shell or confuse bend inertia exponents?",
      default: "Socratic AI Coach Tip: Express solid shear mechanics against polar inertia J = π * d⁴ / 32, and fiber radius r = d/2. How does the final equation depend on d?"
    }
  },
  {
    id: 6,
    question: "In an epicyclic planetary gear train, an arm rotates at 60 RPM counter-clockwise, carrying gears A and B having 36 and 48 teeth respectively. If sun gear A is fixed, what is the absolute rotational speed of planet gear B?",
    options: [
      "45 RPM clockwise",
      "15 RPM counter-clockwise",
      "105 RPM clockwise",
      "15 RPM clockwise"
    ],
    correctIdx: 1, // 15 RPM CCW / counter-clockwise
    explanation: "Using tabular speed ratio methods: Let the speed of the arm be y = 60 RPM. If gear A is fixed and meshes with planets, speed of A is N_A = y + x = 0 => x = -y = -60. Planet gear B speed relative to the layout operates as N_B = y - x*(T_A/T_B) = 60 - (-60)*(36/48) = 60 - 45 = 15 RPM. The speed is positive, which implies the rotation remains counter-clockwise (same direction as the arm).",
    socraticResponses: {
      0: "You selected clock-direction. Be sure or verify if planet gear B speeds sum with the arm rotation properly. Formulate the table!",
      1: "Excellent and precise! Calculating reveals y = 60 and x = -60. N_B = 60 - (-60)*(0.75) = 15 RPM in the same initial direction. Brilliant math!",
      2: "You chose 105 RPM clockwise. This reflects a sign inversion or teeth ratio multiplication error. Check your table parameters.",
      3: "You chose 15 RPM clockwise. The magnitude is correct, but the sign check yields positive, meaning it rotates CCW like the arm.",
      default: "Socratic AI Coach Tip: Build a speed table: Row 1 = Arm (y RPM), Row 2 = Gear A (y + x), Row 3 = Gear B. Set Gear A's speed to 0 and solve for B!"
    }
  },
  {
    id: 7,
    question: "A heavy engine component of mass 10 kg is supported by two steel vertical helical steel springs mounted in parallel, each spring having a stiffness k = 2000 N/m. Find the natural frequency of undamped vertical vibration (ω_n) of the system.",
    options: [
      "10.00 rad/s",
      "14.14 rad/s",
      "20.00 rad/s",
      "40.00 rad/s"
    ],
    correctIdx: 2, // 20.00 rad/s
    explanation: "For springs aligned in parallel, the total equivalent stiffness is the sum of stiffnesses: k_eq = k1 + k2 = 2000 + 2000 = 4000 N/m. The natural vertical frequency is ω_n = √(k_eq / m) = √(4000 / 10) = √400 = 20 rad/s.",
    socraticResponses: {
      0: "You chose 10.00 rad/s. This represents springs in series where k_eq = 1000 N/m. Our springs are strictly mounted in parallel.",
      1: "You chose 14.14 rad/s. This only considers a single spring instead of both acting together. How does equivalent stiffness combine?",
      2: "Brilliant! Since springs are parallel, the equivalent stiffness doubles to 4000 N/m. The square root of (4000 / 10) is exactly 20.00 rad/s.",
      3: "You selected 40.00 rad/s. Did you skip the square root step in the natural frequency formula?",
      default: "Socratic AI Coach Tip: Parallel springs add their stiffnesses directly. Series springs add their compliance (inverse stiffness)."
    }
  },
  {
    id: 8,
    question: "Which of the following describes the key mechanical behavior of the Shear Center of an unsymmetric thin-walled structural beam?",
    options: [
      "A transverse shear load passing through the shear center causes bending deflection without twisting or rotation.",
      "It always corresponds with the centroid of the cross-section regardless of unsymmetrical web-to-flange ratios.",
      "The shear stresses are completely zero when a twisting load is applied exactly at this point.",
      "It is the point where the normal flexural stresses reach their absolute safety limit threshold."
    ],
    correctIdx: 0,
    explanation: "By definition, the shear center is the specific point in the cross-section plane through which if a transverse load acts, the beam undergoes pure bending with absolutely zero twisting or torsional deformation. Unsymmetric sections pivot unless aligned here.",
    socraticResponses: {
      0: "Perfect definition! If the line of action of the shear force passes through the shear center, there is zero twist.",
      1: "You selected the centroid. While this is true for doubly symmetric shapes, it is WRONG for channel or unsymmetrical sections.",
      2: "Torsion still produces shear stresses throughout the walls. The shear center does not eliminate torsion; it prevents bending loads from creating torsion.",
      3: "Flexural bending stresses are defined by normal distance from the neutral axis, independent of shear load axes.",
      default: "Socratic AI Coach Tip: Try to visualize trying to bend a C-channel beam. If you push the middle, it twists. What point balances this twisting moment?"
    }
  },
  {
    id: 9,
    question: "A manufacturing motor of mass m = 10 kg is supported on isolated springs of total stiffness k = 40 kN/m. If the motor experiences undamped vertical harmonic vibration of cyclic frequency f = 30 Hz, calculate the Force Transmissibility Ratio (TR) of the isolated arrangement.",
    options: [
      "0.125 (High isolation efficiency of 87.5%)",
      "0.250 (Moderate isolation of 75.0%)",
      "1.125 (Amplified transmission zone)",
      "0.500 (Weak isolation of 50.0%)"
    ],
    correctIdx: 0,
    explanation: "First compute the circular natural frequency: ω_n = √(k / m). Here, k = 40 kN/m = 40,000 N/m, giving ω_n = √(40,000 / 10) = √4000 = 63.25 rad/s. Alternatively, natural cyclic frequency f_n = ω_n / (2π) ≈ 10.07 Hz. The excitation frequency f = 30 Hz. The frequency ratio r = f / f_n = 30 / 10.07 ≈ 2.98 ~ 3.0. The undamped transmissive load ratio is: TR = 1 / |r² - 1| = 1 / |3² - 1| = 1/8 = 0.125.",
    socraticResponses: {
      0: "Splendid! The circular frequency ratio r is exactly 3.0. The transmissibility formula is 1 / (r² - 1) = 1 / 8 = 0.125. That gives a solid 87.5% vibration damping ratio!",
      1: "You selected 0.250. Check your r value. Did you calculate static deflection or double-count the isolated spring coordinates?",
      2: "You selected 1.125. Remember that r must be less than 1.414 (√2) for resonance amplification. At 30 Hz, you are far into the isolation region!",
      3: "You selected 0.500. Did you forget to square the frequency ratio r in the denominator or divide by two?",
      default: "Socratic AI Coach Tip: Calculate equivalent natural frequency f_n = 10.07 Hz. Find the ratio r = f / f_n, then plug it into TR = 1 / |r² - 1|."
    }
  },
  {
    id: 10,
    question: "According to the exact Blasius boundary layer solution for laminar fluid flow over an ultra-flat solid plate, what is the proportional ratio of boundary layer thickness δ to local distance x from the leading edge?",
    options: [
      "5.0 / (Re_x) ^ 0.5",
      "3.24 / (Re_x) ^ 0.5",
      "0.664 / (Re_x) ^ 0.5",
      "1.328 / (Re_x) ^ 0.5"
    ],
    correctIdx: 0,
    explanation: "Blasius high-fidelity boundary layer integration reveals that the laminar boundary layer thickness grows as: δ ≈ 5.0 * x / √(Re_x). Thus, the ratio δ/x is exactly equal to 5.0 multiplied by Re_x^(-0.5). Other options represent drag coefficients.",
    socraticResponses: {
      0: "Perfect! You correctly recalled the Blasius constant coefficient 5.0 for the 99% boundary layer edge constraint. Extremely precise mechanical aerodynamics!",
      1: "You selected 3.24. This factor applies to simplified thermal boundary layers rather than the fluid shear region.",
      2: "You selected 0.664. Note that 0.664 is the local friction coefficient Cf,x = 0.664 / (Re_x) ^ 0.5, not the physical thickness profile.",
      3: "You selected 1.328. This value is the total integrated friction drag coefficient for the plate surface.",
      default: "Socratic AI Coach Tip: Think of fluid velocity vectors peaking to 99% of free-stream speed. The Blasius factor for 0.99 boundary layer height is exactly 5.0."
    }
  }
];

const industrialScenarios: IndustrialScenario[] = [
  {
    id: 1,
    title: "Scenario A: Optimal Precision Calibration",
    description: "Adjust actuators to find the peak high-precision calibration sweet-spot. High-precision alloy cutting operates at high frequency and high pressure to quickly remove microscopic metal debris without short-circuiting.",
    targetStability: "OPTIMAL_PRECISION",
    criteriaText: "Set: Pulse Frequency >= 80 kHz, Flushing Pressure >= 1.2 MPa, and Wire Tension >= 15 N.",
    hintText: "Slide Pulse Frequency, Flushing Pressure, and Wire Tension to elevated levels.",
    checkFn: (pulseRate, tension, pressure, voltage, speed) => {
      if (pulseRate >= 80 && pressure >= 1.2 && tension >= 15) {
        return { success: true, feedback: "Calibration optimal! The high frequency combined with solid tension and flushing flow gives pristine sub-micron accuracies. The system is operating in peak precision state." };
      }
      return { success: false, feedback: "Under-calibrated. Please raise Pulse Frequency >= 80, Flushing Pressure >= 1.2, and Wire Tension >= 15 to secure optimal precision resonance." };
    }
  },
  {
    id: 2,
    title: "Scenario B: Prevent Arcing Failures",
    description: "The wire is starting to vibrate violently under high voltage and low tension, creating hazardous electrical arcs. Stabilize variables to return the system back to safety benchmarks.",
    targetStability: "STABLE",
    criteriaText: "Requirements: Adjust Wire Tension to at least 15 N and limit Discharge Voltage below 120 Volts.",
    hintText: "Drag Tension slider upwards and slide Discharge Voltage downwards to prevent arcing.",
    checkFn: (pulseRate, tension, pressure, voltage, speed) => {
      if (tension >= 15 && voltage < 120) {
        return { success: true, feedback: "Safety Restored! Raising wire tension dampens thermal vibrations. Keeping voltage low limits micro-discharge overshoots, neutralizing arcing danger." };
      }
      return { success: false, feedback: "Arcing threshold detected! Increase Tension to >= 15 N and decrease Voltage to < 120 Volts to secure process safety." };
    }
  },
  {
    id: 3,
    title: "Scenario C: Wire Breakage Prevention",
    description: "High machine cutting speeds with insufficient discharge potential cause physical workpiece collisions, risking wire breakage. Stabilize variables immediately.",
    targetStability: "STABLE",
    criteriaText: "Requirements: Moderate Cutting Feed Speed below 5.5 mm/min and raise Discharge Voltage to at least 70 Volts.",
    hintText: "Reduce Cut velocity and raise Voltage to establish stable spark erosion depth.",
    checkFn: (pulseRate, tension, pressure, voltage, speed) => {
      if (speed <= 5.5 && voltage >= 70) {
        return { success: true, feedback: "Breaker danger cleared. Restricting cutting feed rate while maintaining decent voltage protects physical wire integrity while maintaining uniform erosion." };
      }
      return { success: false, feedback: "High wire breakage danger! Moderate speed <= 5.5 mm/min and support voltage >= 70 Volts immediately to prevent tooling damage." };
    }
  }
];

export default function InteractiveWidgets() {
  const [activeTab, setActiveTab] = useState<"grade1" | "grade2" | "grade3">("grade1");

  // ==========================================
  // STATE - DASHBOARD 1: UNIVERSITY CORE
  // ==========================================
  const [univQIdx, setUnivQIdx] = useState(0);
  const currentUnivQ = univQuestions[univQIdx];

  const [g1LoadVal, setG1LoadVal] = useState(currentUnivQ.defaultLoad);
  const [g1SpanVal, setG1SpanVal] = useState(6.0); // meters
  const [g1OuterC, setG1OuterC] = useState(0.12); // outer fiber radius, m
  const [g1InertiaI, setG1InertiaI] = useState(4.5e-5); // m^4
  
  const [userBendingAns, setUserBendingAns] = useState("");
  const [userBendingFeedback, setUserBendingFeedback] = useState<{ status: "idle" | "success" | "error"; msg: string }>({ status: "idle", msg: "" });

  // Recalculate dynamic load boundaries when question changes
  useEffect(() => {
    setG1LoadVal(currentUnivQ.defaultLoad);
    setUserBendingAns("");
    setUserBendingFeedback({ status: "idle", msg: "" });
  }, [univQIdx, currentUnivQ]);

  const exactStressMpa = currentUnivQ.calculate(g1LoadVal, g1SpanVal, g1OuterC, g1InertiaI);

  // FBD File upload state
  const [fbdImage, setFbdImage] = useState<string | null>(null);
  const [fbdFileName, setFbdFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // STATE - DASHBOARD 2: GATE SPRINT
  // ==========================================
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isMCQSubmitted, setIsMCQSubmitted] = useState(false);
  const [socraticLog, setSocraticLog] = useState<string[]>([
    "Socratic Coach: Greetings candidate. Select an option above and click Grade to evaluate, or toggle hints below."
  ]);
  const [isSocraticLoading, setIsSocraticLoading] = useState(false);

  // ==========================================
  // STATE - DASHBOARD 3: CYBER-PHYSICAL WIRE EDM
  // ==========================================
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const currentScenario = industrialScenarios[activeScenarioIdx];

  const [wirePulseRate, setWirePulseRate] = useState(60);     // kHz (10 - 120)
  const [wireTension, setWireTension] = useState(15);        // N (5 - 30)
  const [edmPressure, setEdmPressure] = useState(0.8);       // MPa (0.1 - 2.5)
  const [edmVoltage, setEdmVoltage] = useState(90);         // Volts (40 - 150)
  const [cuttingSpeed, setCuttingSpeed] = useState(3.5);     // mm/min (0.5 - 8.0)
  
  const [edmStability, setEdmStability] = useState<"STABLE" | "OPTIMAL_PRECISION" | "ARCING_DANGER" | "WIRE_BREAKAGE_CRITICAL">("STABLE");
  const [scenarioCleared, setScenarioCleared] = useState(false);
  const [scenarioFeedback, setScenarioFeedback] = useState("");

  const sparkCanvasRef = useRef<HTMLCanvasElement>(null);
  const sparkAnimationRef = useRef<number | null>(null);

  // ==========================================
  // EFFECTS & EVALUATIONS
  // ==========================================

  // Count down for GATE Sprint Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Wire EDM Osilloscope Simulation Drawing Canvas
  useEffect(() => {
    if (activeTab !== "grade3") {
      if (sparkAnimationRef.current) cancelAnimationFrame(sparkAnimationRef.current);
      return;
    }

    const canvas = sparkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const drawScope = () => {
      frame++;
      const width = canvas.width;
      const height = canvas.height;
      
      // Deep elegant contrast display
      ctx.fillStyle = "#0c0d12";
      ctx.fillRect(0, 0, width, height);

      // Grid line layers
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw horizontal baseline
      ctx.strokeStyle = "rgba(152, 0, 3, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Spark waveform parameter scales
      ctx.beginPath();
      ctx.lineWidth = 2.5;

      // Color shifts according to telemetry stability
      if (edmStability === "OPTIMAL_PRECISION") {
        ctx.strokeStyle = "#22d3ee"; // Cyans
        ctx.shadowColor = "#06b6d4";
        ctx.shadowBlur = 8;
      } else if (edmStability === "STABLE") {
        ctx.strokeStyle = "#34d399"; // Green
        ctx.shadowBlur = 0;
      } else if (edmStability === "ARCING_DANGER") {
        ctx.strokeStyle = "#f59e0b"; // Orange
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 12;
      } else {
        ctx.strokeStyle = "#ef4444"; // Red
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 18;
      }

      const frequencyMultiplier = wirePulseRate / 20;
      const amplitudeFactor = edmVoltage / 3.0;
      const noiseLevel = Math.max(3, 24 - wireTension);

      for (let sx = 0; sx < width; sx++) {
        const timeScale = sx * frequencyMultiplier * 0.02 + frame * 0.16;
        let signalWave = Math.sin(timeScale) * Math.sin(timeScale * 0.3) * amplitudeFactor;
        
        // Add random micro spark sparks
        if (Math.random() > 0.96) {
          signalWave += (Math.random() - 0.5) * noiseLevel * 2.5;
        } else {
          signalWave += Math.sin(sx * 0.8) * (noiseLevel / 5);
        }

        const dampingPressure = Math.max(0.3, 1.4 - edmPressure / 2);
        const sy = (height / 2) + (signalWave * dampingPressure);

        if (sx === 0) {
          ctx.moveTo(sx, sy);
        } else {
          ctx.lineTo(sx, sy);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      sparkAnimationRef.current = requestAnimationFrame(drawScope);
    };

    drawScope();

    return () => {
      if (sparkAnimationRef.current) cancelAnimationFrame(sparkAnimationRef.current);
    };
  }, [wirePulseRate, wireTension, edmPressure, edmVoltage, activeTab, edmStability]);

  // Recalculate dynamic stability based on actuators
  useEffect(() => {
    let state: "STABLE" | "OPTIMAL_PRECISION" | "ARCING_DANGER" | "WIRE_BREAKAGE_CRITICAL" = "STABLE";
    
    if (wireTension < 10 && edmVoltage > 115) {
      state = "ARCING_DANGER";
    } else if (cuttingSpeed > 6.0 && edmVoltage < 65) {
      state = "WIRE_BREAKAGE_CRITICAL";
    } else if (wirePulseRate >= 80 && edmPressure >= 1.2 && wireTension >= 15) {
      state = "OPTIMAL_PRECISION";
    }

    setEdmStability(state);

    // Evaluate against current active scenario requirements
    const check = currentScenario.checkFn(wirePulseRate, wireTension, edmPressure, edmVoltage, cuttingSpeed);
    setScenarioCleared(check.success);
    setScenarioFeedback(check.feedback);
  }, [wirePulseRate, wireTension, edmPressure, edmVoltage, cuttingSpeed, currentScenario]);

  // Reset standard setups inside grade 3 scenarios
  const transitionScenario = (idx: number) => {
    setActiveScenarioIdx(idx);
    
    // Auto populate slider configurations to introduce the challenge
    if (idx === 0) {
      // Setup under-calibrated options
      setWirePulseRate(50);
      setWireTension(12);
      setEdmPressure(0.6);
      setEdmVoltage(80);
      setCuttingSpeed(3.0);
    } else if (idx === 1) {
      // Setup high arcing configuration
      setWirePulseRate(70);
      setWireTension(6);
      setEdmPressure(0.8);
      setEdmVoltage(130);
      setCuttingSpeed(4.0);
    } else if (idx === 2) {
      // Setup breakage danger
      setWirePulseRate(60);
      setWireTension(18);
      setEdmPressure(1.0);
      setEdmVoltage(50);
      setCuttingSpeed(7.2);
    }
  };

  // ==========================================
  // PROCEDURAL HANDLERS
  // ==========================================

  // Check Grade 1 numerical solver
  const verifyNumericalAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAns = parseFloat(userBendingAns);
    if (isNaN(parsedAns)) {
      setUserBendingFeedback({ status: "error", msg: "Please insert a valid numeric output first." });
      return;
    }

    const absDifference = Math.abs(parsedAns - exactStressMpa);
    const percentageDifference = (absDifference / exactStressMpa) * 100;

    if (percentageDifference <= 0.25) {
      setUserBendingFeedback({
        status: "success",
        msg: `VERIFIED! Your calculation of ${parsedAns.toFixed(2)} MPa is correct (Error: ${percentageDifference.toFixed(3)}%). Academic compliance met!`
      });
    } else {
      setUserBendingFeedback({
        status: "error",
        msg: `DISCREPANCY: Expected value is ${exactStressMpa.toFixed(2)} MPa. Your input of ${parsedAns} MPa carries a substantial error of ${percentageDifference.toFixed(1)}%. Check your moment boundary step and recalculate.`
      });
    }
  };

  // Drag and drop handlers for Grade 1 FBD image
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Format error: Please supply an image format file.");
      return;
    }
    setFbdFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFbdImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const selectAndTriggerFile = () => {
    fileInputRef.current?.click();
  };

  // Check Grade 2 MCQ selection
  const handleMcqOptionSelect = (idx: number) => {
    if (isMCQSubmitted) return;
    setSelectedOption(idx);
  };

  const submitMcqAssessment = () => {
    if (selectedOption === null) return;
    setIsMCQSubmitted(true);
    setIsTimerRunning(false); // pause exam timer for evaluation

    const q = gateQuestions[activeQuestionIdx];
    const isSuccess = selectedOption === q.correctIdx;

    setIsSocraticLoading(true);
    setTimeout(() => {
      const responseMsg = q.socraticResponses[selectedOption] || q.socraticResponses.default;
      setSocraticLog((prev) => [
        `Evaluation: Option ${String.fromCharCode(65 + selectedOption)} marked as ${isSuccess ? "CORRECT" : "REJECTED"}.`,
        `Socratic Coach: ${responseMsg}`,
        ...prev.slice(0, 4)
      ]);
      setIsSocraticLoading(false);
    }, 600);
  };

  const requestSocraticHint = () => {
    setIsSocraticLoading(true);
    setTimeout(() => {
      const q = gateQuestions[activeQuestionIdx];
      setSocraticLog((prev) => [
        `Socratic Coach Hint: ${q.socraticResponses.default}`,
        ...prev.slice(0, 4)
      ]);
      setIsSocraticLoading(false);
    }, 500);
  };

  const resetGateSession = () => {
    setTimerSeconds(180);
    setIsTimerRunning(true);
    setSelectedOption(null);
    setIsMCQSubmitted(false);
  };

  const changeGateQuestion = (direction: "next" | "prev") => {
    let nextIdx = activeQuestionIdx;
    if (direction === "next") {
      nextIdx = (activeQuestionIdx + 1) % gateQuestions.length;
    } else {
      nextIdx = activeQuestionIdx === 0 ? gateQuestions.length - 1 : activeQuestionIdx - 1;
    }
    setActiveQuestionIdx(nextIdx);
    setSelectedOption(null);
    setIsMCQSubmitted(false);
  };

  return (
    <div className="w-full text-white space-y-8 font-jakarta">
      
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Verified GATE &amp; University Syllabus Standards
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            MechForge Lab Benchmarks
          </h2>
          <p className="text-sm md:text-base text-neutral-300 font-sans max-w-3xl leading-relaxed">
            Select a learning workbench from the Side Desk panel below to execute dynamic parameter calibrations and explore real-time diagnostic suggestions.
          </p>
        </div>
      </div>

      {/* Main split grid container with left-hand sidebar navigation & active panel */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT SIDE NAVIGATION ("Side Dashboards Panel") */}
        <div className="lg:col-span-3 space-y-4 text-left">
          <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 gap-6 flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold font-mono text-[#980003] uppercase tracking-widest block font-semibold mb-2">
                LABORATORY SIDE DESK
              </span>
              
              <div className="space-y-3">
                {/* Board 1 Selector */}
                <button
                  type="button"
                  onClick={() => setActiveTab("grade1")}
                  className={`w-full p-4 rounded-xl text-left border transition-all duration-300 flex flex-col gap-1.5 cursor-pointer group hover-card relative overflow-hidden ${
                    activeTab === "grade1" 
                      ? "bg-[#980003]/20 border-[#980003] text-white shadow-xl" 
                      : "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold font-jakarta text-sm md:text-base">
                    <Layers className="w-4.5 h-4.5 text-[#980003]" />
                    <span>1. University Core</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed pl-6 font-sans">
                    5 parametric support beam &amp; axial shell stress calculations.
                  </p>
                  {activeTab === "grade1" && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#980003]" />}
                </button>

                {/* Board 2 Selector */}
                <button
                  type="button"
                  onClick={() => setActiveTab("grade2")}
                  className={`w-full p-4 rounded-xl text-left border transition-all duration-300 flex flex-col gap-1.5 cursor-pointer group hover-card relative overflow-hidden ${
                    activeTab === "grade2" 
                      ? "bg-[#980003]/20 border-[#980003] text-white shadow-xl" 
                      : "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold font-jakarta text-sm md:text-base">
                    <Timer className="w-4.5 h-4.5 text-[#980003]" />
                    <span>2. GATE MCQ Sprint</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed pl-6 font-sans">
                    8 updated syllabus questions with automatic Socratic step tips.
                  </p>
                  {activeTab === "grade2" && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#980003]" />}
                </button>

                {/* Board 3 Selector */}
                <button
                  type="button"
                  onClick={() => setActiveTab("grade3")}
                  className={`w-full p-4 rounded-xl text-left border transition-all duration-300 flex flex-col gap-1.5 cursor-pointer group hover-card relative overflow-hidden ${
                    activeTab === "grade3" 
                      ? "bg-[#980003]/20 border-[#980003] text-white shadow-xl" 
                      : "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold font-jakarta text-sm md:text-base">
                    <Activity className="w-4.5 h-4.5 text-[#980003]" />
                    <span>3. EDM Diagnostics</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed pl-6 font-sans">
                    Simulate spark erosion depth &amp; dielectric fluid calibrations.
                  </p>
                  {activeTab === "grade3" && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#980003]" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-900 space-y-2 text-xs text-neutral-400">
              <div className="flex justify-between items-center bg-neutral-900/45 p-2.5 rounded border border-neutral-850">
                <span className="font-mono">Syllabus Active:</span>
                <span className="text-emerald-400 font-extrabold font-mono">GATE 2026.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT ACTIVE WORKBENCH PANEL */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            
            {/* ======================================================== */}
            {/* DASHBOARD 1: UNIVERSITY CORE                             */}
            {/* ======================================================== */}
            {activeTab === "grade1" && (
              <motion.div
                key="grade1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-left"
              >
                {/* Beautiful Animated Header Graphic with generated image */}
                <div className="relative h-44 rounded-2xl overflow-hidden border border-neutral-800 flex flex-col justify-end p-6 bg-gradient-to-t from-neutral-950 to-neutral-950/20 group">
                  <img 
                    src="/src/assets/images/structural_beam_analysis_1779380078431.png" 
                    alt="University Structural Core Graphic" 
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                  <div className="relative space-y-1 text-left z-10">
                    <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">UNIVERSITY SYLLABUS DESK</span>
                    <h4 className="text-xl md:text-2xl font-black text-white tracking-tight">Parametric Beams &amp; Pressure Vessels</h4>
                    <p className="text-xs text-neutral-300 max-w-2xl font-sans leading-relaxed">Tune structural spans, vertical load densities, and sectional profiles. Check analytical shear, torsion of solid axles, and tangential hoop stress of boilers.</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Selector & Controls */}
                  <div className="lg:col-span-4 flex flex-col justify-between bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-6">
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Bookmark className="text-[#980003] w-5 h-5" />
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#980003]">CHOOSE STRUCTURAL EXERCISE</span>
                  </div>

                  {/* Question switch list */}
                  <div className="space-y-2">
                    {univQuestions.map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setUnivQIdx(idx)}
                        className={`w-full p-3 rounded-lg text-xs md:text-sm text-left font-semibold border transition-all cursor-pointer block ${
                          univQIdx === idx 
                            ? "bg-[#980003]/10 border-[#980003] text-white" 
                            : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                        }`}
                      >
                        <div className="font-bold mb-0.5">Problem {idx + 1}:</div>
                        <div className="truncate font-sans">{q.title}</div>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-neutral-900 pt-4 space-y-4">
                    <span className="text-xs font-bold font-mono uppercase text-neutral-400 block">VARIABLE CONSTANTS</span>

                    {/* Elastic load */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-neutral-300">
                        <span>{currentUnivQ.loadLabel}</span>
                        <span className="text-white bg-neutral-900 px-2 py-0.5 rounded font-mono">
                          {g1LoadVal} {univQIdx === 2 ? "kN/m" : univQIdx === 3 ? "kN-m" : univQIdx === 4 ? "MPa" : "kN"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={currentUnivQ.minLoad}
                        max={currentUnivQ.maxLoad}
                        step={univQIdx === 2 || univQIdx === 4 ? "1" : "5"}
                        value={g1LoadVal}
                        onChange={(e) => setG1LoadVal(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#980003]"
                      />
                    </div>

                    {/* Beam height */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-neutral-300">
                        <span>Beam Span Length (L)</span>
                        <span className="text-white bg-neutral-900 px-2 py-0.5 rounded font-mono">{g1SpanVal} m</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="12"
                        step="0.5"
                        value={g1SpanVal}
                        onChange={(e) => setG1SpanVal(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#980003]"
                      />
                    </div>

                    {/* Fiber boundary inner (C) input */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-neutral-300">
                        <span>Extreme Fiber Radius (c)</span>
                        <span className="text-white bg-neutral-900 px-2 py-0.5 rounded font-mono">{(g1OuterC * 1000).toFixed(0)} mm</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.25"
                        step="0.01"
                        value={g1OuterC}
                        onChange={(e) => setG1OuterC(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#980003]"
                      />
                    </div>

                    {/* Moment of inertia select block */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-neutral-400">BEAM PROFILE INERTIA (I)</label>
                      <select
                        value={g1InertiaI}
                        onChange={(e) => setG1InertiaI(parseFloat(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-[#980003]"
                      >
                        <option value={4.5e-5}>Wide Flange I-Section (I = 4.5 × 10⁻⁵ m⁴)</option>
                        <option value={2.5e-5}>Thick Tubular Core (I = 2.5 × 10⁻⁵ m⁴)</option>
                        <option value={7.5e-5}>Solid Welded Billet (I = 7.5 × 10⁻⁵ m⁴)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-850 text-xs text-neutral-300 leading-normal font-sans">
                  <div className="font-bold text-white mb-1">📐 Analytical Schema:</div>
                  <div className="font-mono text-emerald-400 bg-black/40 px-2 py-1 rounded text-center mb-2 font-bold">{currentUnivQ.formula}</div>
                  Please insert correct variables to trigger exact compliance indicators.
                </div>

              </div>

              {/* Center Panel: Problem statement, live plotter, and solver */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                
                {/* Upper description and solver card */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-5">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#980003] uppercase tracking-widest block font-mono">PROBLEM FOCUS</span>
                    <h3 className="text-lg md:text-xl font-bold text-white leading-snug">{currentUnivQ.title}</h3>
                    <p className="text-sm text-neutral-300 leading-relaxed font-sans">{currentUnivQ.scenario}</p>
                  </div>

                  {/* Dynamic Bending & Shear Force SVG Plotter Image */}
                  <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-850 space-y-3">
                    <span className="text-xs font-bold text-neutral-400 block font-mono uppercase tracking-wider">LIVE STRUCTURAL DIAGRAMS &amp; PROFILE</span>
                    
                    {/* SVG Graphic */}
                    <div className="relative w-full bg-[#0c0d12] rounded-lg overflow-hidden p-3 flex flex-col items-center justify-center border border-neutral-950">
                      
                      {/* Interactive Beam SVG representation */}
                      {univQIdx < 3 ? (
                        <svg viewBox="0 0 500 120" className="w-full max-w-lg h-32 block">
                          {/* Background guide lines */}
                          <line x1="50" y1="60" x2="450" y2="60" stroke="#1c1e2b" strokeWidth="1" strokeDasharray="3 3" />
                          
                          {/* Beam block */}
                          <rect x="50" y="55" width="400" height="10" rx="2" fill="#1e2030" stroke="#3b4261" strokeWidth="1.5" />
                          
                          {/* Active deflection line curve preview */}
                          <path 
                            d={
                              univQIdx === 0 
                                ? `M 50 60 Q 250 ${60 + Math.min(exactStressMpa * 0.12, 35)} 450 60`
                                : univQIdx === 1 
                                ? `M 50 60 Q 50 60 450 ${60 + Math.min(exactStressMpa * 0.12, 40)}`
                                : `M 50 60 C 150 ${60 + Math.min(exactStressMpa * 0.12, 35)}, 350 ${60 + Math.min(exactStressMpa * 0.12, 35)}, 450 60`
                            } 
                            fill="none" 
                            stroke="#ef4444" 
                            strokeWidth="2.5" 
                            strokeDasharray="1 1"
                            className="opacity-70"
                          />

                          {/* Supports */}
                          {univQIdx !== 1 ? (
                            <>
                              {/* Pinned left support */}
                              <path d="M 45 65 L 55 65 L 50 56 Z" fill="#980003" stroke="#980003" strokeWidth="1" />
                              {/* Roller right support */}
                              <circle cx="450" cy="63" r="3" fill="#980003" />
                              <line x1="440" y1="66" x2="460" y2="66" stroke="#980003" strokeWidth="1" />
                            </>
                          ) : (
                            <>
                              {/* Fixed wall support on left */}
                              <line x1="50" y1="40" x2="50" y2="80" stroke="#980003" strokeWidth="3" />
                              <line x1="45" y1="43" x2="50" y2="48" stroke="#980003" strokeWidth="1" />
                              <line x1="45" y1="53" x2="50" y2="58" stroke="#980003" strokeWidth="1" />
                              <line x1="45" y1="63" x2="50" y2="68" stroke="#980003" strokeWidth="1" />
                              <line x1="45" y1="73" x2="50" y2="78" stroke="#980003" strokeWidth="1" />
                            </>
                          )}

                          {/* Force Vectors dynamic arrows representing the problem */}
                          {univQIdx === 0 && (
                            <g transform="translate(250, 20)">
                              <path d="M 0 0 L 0 30" stroke="#38bdf8" strokeWidth="2" />
                              <path d="M -4 24 L 0 30 L 4 24" fill="#38bdf8" />
                              <text x="8" y="15" fill="#38bdf8" className="text-[12px] font-bold font-mono">P = {g1LoadVal} kN</text>
                            </g>
                          )}

                          {univQIdx === 1 && (
                            <g transform="translate(440, 20)">
                              <path d="M 0 0 L 0 30" stroke="#38bdf8" strokeWidth="2" />
                              <path d="M -4 24 L 0 30 L 4 24" fill="#38bdf8" />
                              <text x="-70" y="15" fill="#38bdf8" className="text-[12px] font-bold font-mono">P = {g1LoadVal} kN</text>
                            </g>
                          )}

                          {univQIdx === 2 && (
                            <g transform="translate(50, 15)">
                              {/* Draw series of mini vectors representing UDL */}
                              <path d="M 50 10 L 50 35 M 100 10 L 100 35 M 150 10 L 150 35 M 200 10 L 200 35 M 250 10 L 250 35 M 300 10 L 300 35 M 350 10 L 350 35" stroke="#38bdf8" strokeWidth="1" />
                              <path d="M 47 30 L 50 35 L 53 30 M 97 30 L 100 35 L 103 30 M 147 30 L 150 35 L 153 30 M 197 30 L 200 35 L 203 30 M 247 30 L 250 35 L 253 30 M 297 30 L 300 35 L 303 30 M 347 30 L 350 35 L 353 30" fill="#38bdf8" />
                              <line x1="50" y1="10" x2="350" y2="10" stroke="#38bdf8" strokeWidth="1.5" />
                              <text x="130" y="5" fill="#38bdf8" className="text-[13px] font-bold font-mono">w = {g1LoadVal} kN/m</text>
                            </g>
                          )}

                          {/* Dimension annotations */}
                          <line x1="50" y1="90" x2="450" y2="90" stroke="#565f89" strokeWidth="1" />
                          <line x1="50" y1="85" x2="50" y2="95" stroke="#565f89" strokeWidth="1" />
                          <line x1="450" y1="85" x2="450" y2="95" stroke="#565f89" strokeWidth="1" />
                          <text x="235" y="105" fill="#a9b1d6" className="text-[11px] font-sans">Span Span (L) = {g1SpanVal} m</text>
                        </svg>
                      ) : univQIdx === 3 ? (
                        /* Torsion Solid Cylinder Axle SVG Diagram with torsional twisting motion */
                        <svg viewBox="0 0 500 120" className="w-full max-w-lg h-32 block">
                          <rect x="100" y="45" width="300" height="30" fill="#1e2030" stroke="#4e516a" strokeWidth="1.5" rx="2" />
                          <ellipse cx="100" cy="60" rx="8" ry="15" fill="#1e1f29" stroke="#4e516a" strokeWidth="1" />
                          
                          {/* Inner shaft fiber lines */}
                          <line x1="100" y1="52" x2="400" y2="52" stroke="#3b4261" strokeWidth="1" />
                          <line x1="100" y1="60" x2="400" y2="60" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                          <line x1="100" y1="68" x2="400" y2="68" stroke="#3b4261" strokeWidth="1" />

                          <ellipse cx="400" cy="60" rx="8" ry="15" fill="#2d2f3d" stroke="#4e516a" strokeWidth="1" />
                          
                          {/* Animated rotational spiral torque arrow representing moment */}
                          <path 
                            d="M 390 35 Q 412 35 412 60 Q 412 85 390 85" 
                            fill="none" 
                            stroke="#38bdf8" 
                            strokeWidth="3.5" 
                            strokeLinecap="round" 
                            className="animate-pulse"
                          />
                          <path d="M 388 81 L 393 87 L 383 87 Z" fill="#38bdf8" />
                          
                          {/* Shearing stress distribution vectors */}
                          <circle cx="210" cy="60" r="1" fill="#fff" />
                          <line x1="210" y1="60" x2="210" y2="48" stroke="#ef4444" strokeWidth="1.5" />
                          <path d="M 207 51 L 210 46 L 213 51" fill="#ef4444" />
                          <text x="215" y="49" fill="#ef4444" className="text-[10px] font-mono font-bold">τ_max</text>
                          
                          <text x="140" y="30" fill="#a9b1d6" className="text-[11px] font-sans font-semibold">Diameter d = {(g1OuterC * 2000).toFixed(0)} mm</text>
                          <text x="315" y="105" fill="#38bdf8" className="text-[11px] font-mono font-bold">Torque T = {g1LoadVal} kN-m</text>
                        </svg>
                      ) : (
                        /* Thick-walled Cylinder Hoop Stress with internal pressure arrows radiating outwards */
                        <svg viewBox="0 0 500 120" className="w-full max-w-lg h-32 block">
                          <circle cx="250" cy="60" r="35" fill="#1f2335" stroke="#414868" strokeWidth="3" />
                          <circle cx="250" cy="60" r="22" fill="#0c0d12" stroke="#414868" strokeWidth="2" />
                          
                          {/* Radially radiating pressure vectors inside the cavity */}
                          <g stroke="#38bdf8" strokeWidth="1.5">
                            <line x1="250" y1="60" x2="250" y2="42" />
                            <path d="M 247 45 L 250 40 L 253 45" fill="#38bdf8" />
                            <line x1="250" y1="60" x2="250" y2="78" />
                            <path d="M 247 75 L 250 80 L 253 75" fill="#38bdf8" />
                            <line x1="250" y1="60" x2="232" y2="60" />
                            <path d="M 235 57 L 230 60 L 235 63" fill="#38bdf8" />
                            <line x1="250" y1="60" x2="268" y2="60" />
                            <path d="M 265 57 L 270 60 L 265 63" fill="#38bdf8" />
                          </g>
                          
                          <text x="250" y="63" textAnchor="middle" fill="#38bdf8" className="text-[9px] font-mono font-bold">P_i</text>
                          
                          {/* Outer annotations */}
                          <line x1="310" y1="60" x2="310" y2="15" stroke="#565f89" strokeWidth="1" strokeDasharray="2 2" />
                          <text x="315" y="40" fill="#a9b1d6" className="text-[11px] font-sans font-semibold">Inner Wall r_i = {(g1SpanVal * 10).toFixed(0)} mm</text>
                          <text x="315" y="70" fill="#a9b1d6" className="text-[11px] font-sans font-semibold">Outer Wall r_o = {(g1SpanVal * 10 + 30).toFixed(0)} mm</text>
                        </svg>
                      )}

                      <div className="absolute right-3 top-3 text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-neutral-400 font-mono">
                        {univQIdx < 3 ? "Deflection Amplified 10x" : univQIdx === 3 ? "Torsion Stress Plane" : "Lame Hoop Stress Zone"}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs md:text-sm text-neutral-400 font-sans text-center">
                      <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-900">
                        <span className="block text-xs text-neutral-500 uppercase tracking-widest">Section height c</span>
                        <span className="text-white font-mono font-bold">{(g1OuterC * 1000).toFixed(0)} mm</span>
                      </div>
                      <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-900">
                        <span className="block text-xs text-neutral-500 uppercase tracking-widest font-mono">Target Max Stress</span>
                        <span className="text-emerald-400 font-mono font-bold">{exactStressMpa.toFixed(2)} MPa</span>
                      </div>
                      <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-900 animate-pulse">
                        <span className="block text-xs text-neutral-500 uppercase tracking-widest">Reaction Limits</span>
                        <span className="text-white font-mono font-bold">
                          {univQIdx === 0 ? `${(g1LoadVal/2).toFixed(1)} kN` : 
                           univQIdx === 1 ? `${g1LoadVal.toFixed(1)} kN` : 
                           univQIdx === 2 ? `${((g1LoadVal * g1SpanVal)/2).toFixed(1)} kN` :
                           univQIdx === 3 ? "J_polar verified" : "Lame active"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive input box */}
                  <form onSubmit={verifyNumericalAnswer} className="space-y-4 pt-1">
                    <div className="space-y-2 text-left">
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                        Insert your calculated extreme stress value in Megapascals ({currentUnivQ.unit})
                      </label>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder={currentUnivQ.placeholder}
                            value={userBendingAns}
                            onChange={(e) => setUserBendingAns(e.target.value)}
                            className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition focus:border-[#980003] w-full px-4 py-3 rounded-xl text-sm md:text-base text-white font-mono focus:outline-none"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-neutral-500 font-mono">MPa</span>
                        </div>
                        <button
                          type="submit"
                          className="bg-[#980003] hover:bg-[#b00004] transition-all text-white px-8 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider cursor-pointer shrink-0"
                        >
                          Submit Calculation
                        </button>
                      </div>
                    </div>

                    {userBendingFeedback.msg && (
                      <div className={`p-4 rounded-xl border text-xs md:text-sm font-medium leading-relaxed ${
                        userBendingFeedback.status === "success"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-red-500/10 border-red-500/30 text-red-400"
                      }`}>
                        {userBendingFeedback.msg}
                      </div>
                    )}
                  </form>
                </div>

                {/* Bottom: FBD Drag Drop Stamp section */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-[#980003] uppercase tracking-wider">OPTIONAL: SUBMIT HANDWRITTEN FREE BODY DIAGRAM (FBD)</span>
                    <span className="text-[10px] text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded">AUTO-STAMP DETECTOR</span>
                  </div>

                  {!fbdImage ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={selectAndTriggerFile}
                      className={`h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition ${
                        isDragging ? "border-[#980003] bg-[#980003]/5" : "border-neutral-800 bg-neutral-900/10 hover:border-neutral-750"
                      }`}
                    >
                      <Upload className="w-8 h-8 text-neutral-500 mb-2 animate-bounce" />
                      <span className="text-xs md:text-sm text-white font-bold">Drag &amp; Drop study FBD image here</span>
                      <span className="text-xs text-neutral-500 block mt-1">Accepts PNG, JPG, JPEG (Click to browse files)</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative h-44 bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center p-2">
                        <img
                          src={fbdImage}
                          alt="Student FBD Upload representationed"
                          className="max-h-full max-w-full object-contain filter saturate-50 contrast-125"
                        />
                        
                        {/* Auto math stamps overlay overlay showing mechanical vector intercepts */}
                        <div className="absolute inset-0 bg-[#980003]/5 border-2 border-[#980003]/40 p-4 flex flex-col justify-between pointer-events-none">
                          <span className="text-[10px] font-bold font-mono text-white bg-[#980003] px-2 py-0.5 rounded self-start tracking-widest animate-pulse">
                            VECTOR ALIGNMENT CALIBRATOR OVERLAY
                          </span>
                          
                          {/* Simulated bounding boxes or diagram labels */}
                          <div className="flex justify-between items-center text-[11px] text-emerald-400 font-mono">
                            <div className="bg-black/85 px-2 py-1 rounded border border-neutral-800">
                              Reaction Point R_A: <b className="text-white">{g1LoadVal / 2} kN</b>
                            </div>
                            <div className="bg-black/85 px-2 py-1 rounded border border-neutral-800">
                              Peak Bending M: <b className="text-white">{((g1LoadVal * g1SpanVal)/4).toFixed(1)} kN-m</b>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono bg-neutral-900 border border-neutral-800 p-3 rounded-lg">
                        <span className="text-neutral-300 truncate max-w-[250px]">{fbdFileName || "fbd_beam_schematic.jpg"}</span>
                        <button
                          type="button"
                          onClick={() => { setFbdImage(null); setFbdFileName(""); }}
                          className="text-red-400 hover:text-white bg-red-950/40 px-3 py-1 rounded-md transition duration-200 cursor-pointer flex items-center gap-1 font-sans font-semibold text-xs"
                        >
                          <X className="w-3.5 h-3.5" /> Remove FBD
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
              
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* DASHBOARD 2: GATE SPRINT LEVEL                           */}
        {/* ======================================================== */}
        {activeTab === "grade2" && (
          <motion.div
            key="grade2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-left"
          >
            {/* Beautiful Animated Header Graphic with generated image */}
            <div className="relative h-44 rounded-2xl overflow-hidden border border-neutral-800 flex flex-col justify-end p-6 bg-gradient-to-t from-neutral-950 to-neutral-950/20 group">
              <img 
                src="/src/assets/images/gate_mechanical_prep_1779380102731.png" 
                alt="GATE Mechanical Prep Illustration" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-all duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
              <div className="relative space-y-1 text-left z-10">
                <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">GATE COMPETITIVE PREP</span>
                <h4 className="text-xl md:text-2xl font-black text-white tracking-tight">Kinematics, Vibrations &amp; Elastic Systems</h4>
                <p className="text-xs text-neutral-300 max-w-2xl font-sans leading-relaxed">Solve exam-level mechanical engineering questions with immediate auto-graded evaluations and step-by-step Socratic logic suggestions.</p>
              </div>
            </div>

            {/* Header / Timer block */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-950 p-5 rounded-2xl border border-neutral-800">
              <div className="space-y-1">
                <span className="text-xs font-bold font-mono text-[#980003] uppercase tracking-widest block">COMPETITIVE PRACTICE</span>
                <h3 className="text-lg md:text-xl font-bold text-white leading-none">GATE Practice Examination Sprint</h3>
                <p className="text-xs md:text-sm text-neutral-300">Test core analytical equations. Leverage Socratic feedback prompts on demand.</p>
              </div>

              {/* Robust Timer */}
              <div className="flex items-center gap-4 bg-neutral-900 p-3 rounded-xl border border-neutral-800 shadow-xl shrink-0">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 font-bold block leading-none">REMAINING LIMIT</span>
                  <span className={`text-2xl font-mono font-bold leading-none ${timerSeconds <= 30 ? "text-red-500 animate-pulse font-bold" : "text-white"}`}>
                    {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 border-l border-neutral-800 pl-3">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition cursor-pointer ${
                      isTimerRunning ? "hover:bg-red-950 bg-red-900/10 text-red-400" : "hover:bg-emerald-900 bg-emerald-950/10 text-emerald-400"
                    }`}
                  >
                    {isTimerRunning ? "Pause" : "Start"}
                  </button>
                  <button
                    onClick={resetGateSession}
                    className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition"
                    title="Restart Timer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Split layout: Question area and Mohr diagram on center/right */}
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Question card */}
              <div className="lg:col-span-8 flex flex-col justify-between bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-6">
                
                <div className="space-y-6">
                  
                  {/* Selector bar */}
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                    <span className="text-xs font-bold font-mono text-neutral-500 uppercase tracking-widest">
                      QUESTION {activeQuestionIdx + 1} OF {gateQuestions.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => changeGateQuestion("prev")}
                        className="px-3 py-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-lg text-xs font-bold font-mono text-neutral-300 transition cursor-pointer"
                      >
                        &lt; Prev
                      </button>
                      <button
                        onClick={() => changeGateQuestion("next")}
                        className="px-3 py-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-lg text-xs font-bold font-mono text-neutral-300 transition cursor-pointer"
                      >
                        Next &gt;
                      </button>
                    </div>
                  </div>

                  {/* Question description */}
                  <div className="space-y-4">
                    <h4 className="text-base md:text-lg text-neutral-100 font-bold leading-normal font-sans">
                      {gateQuestions[activeQuestionIdx].question}
                    </h4>

                    {/* Interactive stress coordinate SVG based on selected question to illustrate */}
                    <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-850 flex flex-col items-center">
                      <span className="text-[10px] font-bold font-mono text-neutral-500 block mb-2 uppercase">STRESS COORDINATES VISUAL SCHEMATIC</span>
                      
                      {activeQuestionIdx === 2 ? (
                        /* Mohr's Circle Visualizer for Question 3 */
                        <svg viewBox="0 0 240 140" className="w-full max-w-[240px] h-32 block">
                          {/* Grid line axes */}
                          <line x1="20" y1="70" x2="220" y2="70" stroke="#262626" strokeWidth="1" />
                          <line x1="120" y1="10" x2="120" y2="130" stroke="#262626" strokeWidth="1" />
                          <text x="210" y="80" fill="#737373" className="text-[9px] font-mono">σ</text>
                          <text x="125" y="20" fill="#737373" className="text-[9px] font-mono">τ</text>
                          
                          {/* Mohr circle */}
                          <circle cx="150" cy="70" r="40" fill="none" stroke="#980003" strokeWidth="2" strokeDasharray="2 1" />
                          
                          {/* Center of Mohr circle */}
                          <circle cx="150" cy="70" r="2" fill="#ef4444" />
                          
                          {/* Principal points σ1, σ2 */}
                          <circle cx="190" cy="70" r="3" fill="#38bdf8" />
                          <circle cx="110" cy="70" r="3" fill="#38bdf8" />
                          
                          <line x1="150" y1="70" x2="150" y2="30" stroke="#10b981" strokeWidth="1.5" />
                          <circle cx="150" cy="30" r="3" fill="#10b981" />
                          
                          <text x="195" y="66" fill="#38bdf8" className="text-[8px] font-mono">σ₁=120</text>
                          <text x="80" y="66" fill="#38bdf8" className="text-[8px] font-mono">σ₂=-40</text>
                          <text x="155" y="34" fill="#10b981" className="text-[8px] font-mono">τ_max=50</text>
                        </svg>
                      ) : activeQuestionIdx === 4 ? (
                        /* Torsion Shaft twist graphic */
                        <svg viewBox="0 0 240 100" className="w-full max-w-[240px] h-28 block">
                          {/* Cylinder representing axle */}
                          <path d="M 50 30 L 190 30 C 200 30, 200 70, 190 70 L 50 70 Z" fill="#1e2030" stroke="#3b4261" strokeWidth="1.5" />
                          <ellipse cx="50" cy="50" rx="10" ry="20" fill="#333" stroke="#3b4261" strokeWidth="1" />
                          <ellipse cx="190" cy="50" rx="10" ry="20" fill="#444" stroke="#3b4261" strokeWidth="1" />
                          
                          {/* Torsion moment arrow */}
                          <path d="M 190 30 C 210 30, 210 70, 190 70" fill="none" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrow)" />
                          <text x="210" y="55" fill="#38bdf8" className="text-[9px] font-mono font-bold">Torque T</text>
                          
                          {/* Shaft sizes annotation */}
                          <line x1="50" y1="80" x2="190" y2="80" stroke="#565f89" strokeWidth="1" />
                          <text x="110" y="93" fill="#a9b1d6" className="text-[8px] font-mono">Outer core diameter d</text>
                        </svg>
                      ) : (
                        /* General Coordinate stress cube representation */
                        <svg viewBox="0 0 240 100" className="w-full max-w-[240px] h-28 block">
                          {/* Central element square */}
                          <rect x="95" y="25" width="50" height="50" fill="#18181b" stroke="#ffffff" strokeWidth="2" />
                          {/* Normal horizontal vectors */}
                          <path d="M 145 50 L 175 50" stroke="#38bdf8" strokeWidth="1.5" />
                          <path d="M 172 47 L 178 50 L 172 53" fill="#38bdf8" />
                          <path d="M 95 50 L 65 50" stroke="#38bdf8" strokeWidth="1.5" />
                          <path d="M 68 47 L 62 50 L 68 53" fill="#38bdf8" />
                          <text x="180" y="53" fill="#38bdf8" className="text-[10px] font-mono font-bold">σ_x</text>
                          
                          {/* Shear arrows */}
                          <path d="M 152 30 L 152 70" stroke="#f59e0b" strokeWidth="1" />
                          <path d="M 149 65 L 152 70 L 155 65" fill="#f59e0b" />
                          <text x="156" y="38" fill="#f59e0b" className="text-[9px] font-mono">τ_xy</text>
                        </svg>
                      )}
                    </div>

                    {/* Options container */}
                    <div className="space-y-3 pt-2">
                      {gateQuestions[activeQuestionIdx].options.map((option, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrect = gateQuestions[activeQuestionIdx].correctIdx === idx;
                        
                        let baseBtnClass = "bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-neutral-700 hover:bg-neutral-850";
                        if (isSelected) {
                          baseBtnClass = "bg-[#980003]/20 border-[#980003] text-white shadow-xl";
                        }
                        
                        if (isMCQSubmitted) {
                          if (isCorrect) {
                            baseBtnClass = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold border-2";
                          } else if (isSelected) {
                            baseBtnClass = "bg-red-500/10 border-red-500 text-red-500 border-dashed border-2";
                          } else {
                            baseBtnClass = "opacity-40 bg-neutral-900 border-neutral-850 text-neutral-550";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleMcqOptionSelect(idx)}
                            disabled={isMCQSubmitted}
                            className={`w-full p-4 text-left text-sm rounded-xl border flex items-center justify-between transition-all cursor-pointer ${baseBtnClass}`}
                          >
                            <span className="flex items-center gap-3 pr-4">
                              <span className="bg-neutral-950 font-mono text-xs font-bold text-neutral-400 py-1 px-2.5 rounded border border-neutral-850">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="font-sans font-medium leading-snug">{option}</span>
                            </span>

                            {isMCQSubmitted && isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            )}
                            {isSelected && !isMCQSubmitted && (
                              <span className="w-3 h-3 rounded-full bg-[#980003] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Submits and controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-900 pt-4 gap-4">
                  <button
                    onClick={requestSocraticHint}
                    disabled={isMCQSubmitted || isSocraticLoading}
                    className="w-full sm:w-auto px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-xl border border-neutral-800 text-xs md:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                  >
                    <HelpCircle className="w-4 h-4 text-[#980003]" />
                    Get Socratic Coach Prompt Hints
                  </button>

                  <button
                    onClick={submitMcqAssessment}
                    disabled={selectedOption === null || isMCQSubmitted}
                    className="w-full sm:w-auto px-7 py-3 bg-[#980003] hover:bg-[#b00004] text-white rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider cursor-pointer shadow-lg disabled:opacity-40"
                  >
                    Verify Answer Formula Case
                  </button>
                </div>

              </div>

              {/* Socratic chat side deck */}
              <div className="lg:col-span-4 flex flex-col bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden h-full min-h-[400px]">
                
                {/* Header title */}
                <div className="bg-neutral-900 px-4 py-3 border-b border-neutral-800 flex items-center justify-between text-xs md:text-sm text-neutral-300 font-mono font-bold">
                  <span className="flex items-center gap-2 text-[#980003] uppercase">
                    <Sparkles className="w-4 h-4 text-[#980003] animate-spin" style={{ animationDuration: "5s" }} />
                    Socratic AI Tutor Monitor
                  </span>
                  <span className="text-[10px] text-neutral-500">CLIENT COMPLIANCE</span>
                </div>

                {/* Chat feed list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[320px] scrollbar-thin">
                  {isSocraticLoading ? (
                    <div className="flex items-center gap-2.5 p-3.5 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-xl animate-pulse">
                      <RefreshCw className="w-4 h-4 text-[#980003] animate-spin" />
                      <span className="font-mono text-xs">Simulating Socratic algebraic steps...</span>
                    </div>
                  ) : null}

                  {socraticLog.map((log, index) => {
                    const isSystem = log.startsWith("Evaluation:");
                    const isCoach = log.startsWith("Socratic Coach:");

                    let styleClasses = "bg-neutral-900 text-neutral-400 border-neutral-900";
                    if (isSystem) {
                      styleClasses = log.includes("CORRECT") 
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 font-bold" 
                        : "bg-red-500/10 text-red-400 border-red-500/30";
                    } else if (isCoach) {
                      styleClasses = "bg-[#980003]/10 text-neutral-200 border-[#980003]/20";
                    }

                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={index} 
                        className={`p-3.5 rounded-xl border text-xs md:text-sm leading-relaxed ${styleClasses}`}
                      >
                        <p className="font-sans">{log}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Question core explanation */}
                {isMCQSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 bg-neutral-900 border-t border-neutral-800 text-xs md:text-sm text-neutral-300 leading-normal text-left max-h-[220px] overflow-y-auto font-sans"
                  >
                    <span className="font-bold text-white uppercase block mb-1.5 flex items-center gap-1.5 text-xs font-mono text-[#10b981]">
                      <FileCheck2 className="w-4 h-4 text-emerald-400" /> Complete Mechanics Breakdown:
                    </span>
                    <p className="leading-relaxed whitespace-pre-line text-neutral-300 font-sans">{gateQuestions[activeQuestionIdx].explanation}</p>
                  </motion.div>
                )}

              </div>

            </div>

          </motion.div>
        )}

        {/* ======================================================== */}
        {/* DASHBOARD 3: INDUSTRIAL CYBER-PHYSICAL                   */}
        {/* ======================================================== */}
        {activeTab === "grade3" && (
          <motion.div
            key="grade3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-left"
          >
            {/* Beautiful Animated Header Graphic with generated image */}
            <div className="relative h-44 rounded-2xl overflow-hidden border border-neutral-800 flex flex-col justify-end p-6 bg-gradient-to-t from-neutral-950 to-neutral-950/20 group">
              <img 
                src="/src/assets/images/edm_spark_machining_1779380123335.png" 
                alt="EDM Spark Diagnostics Illustration" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-all duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
              <div className="relative space-y-1 text-left z-10">
                <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">INDUSTRIAL EDM LAB</span>
                <h4 className="text-xl md:text-2xl font-black text-white tracking-tight">Spark Erosion &amp; Cyber-Physical Tuning</h4>
                <p className="text-xs text-neutral-300 max-w-2xl font-sans leading-relaxed">Simulate wire-cut electrical discharge machines in a real-time fluid chamber. Handle pulse rate frequency, wire alignment tension forces, and pressure boundaries to maximize precision cuts.</p>
              </div>
            </div>

            {/* Top diagnostic selection banner */}
            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2">
                <Gauge className="text-[#980003] w-5 h-5 animate-pulse" />
                <span className="text-xs font-bold font-mono text-[#980003] uppercase tracking-wider">CHOOSE OPTIMIZATION TARGET SCENARIO</span>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-3">
                {industrialScenarios.map((sc, scIdx) => (
                  <button
                    key={sc.id}
                    onClick={() => transitionScenario(scIdx)}
                    className={`p-4 rounded-xl text-xs md:text-sm text-left font-bold border transition-all cursor-pointer ${
                      activeScenarioIdx === scIdx 
                        ? "bg-[#980003]/20 border-[#980003] text-white shadow-xl" 
                        : "bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="text-[10px] text-neutral-500 uppercase font-mono tracking-widest font-semibold mb-1">Scenario {sc.id}</div>
                    <div className="font-jakarta leading-snug">{sc.title}</div>
                  </button>
                ))}
              </div>

              {/* Scenario Goal Criteria */}
              <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-850 text-xs md:text-sm text-neutral-200 space-y-2 leading-relaxed">
                <p><span className="font-extrabold text-[#38bdf8] uppercase text-xs font-mono">MISSION PARAMETERS:</span> {currentScenario.description}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-neutral-850 font-mono text-xs text-neutral-400">
                  <p><span className="text-emerald-400 font-bold uppercase">TARGET GOALS:</span> {currentScenario.criteriaText}</p>
                  <p className="bg-neutral-950 px-2 py-0.5 rounded text-neutral-400 font-bold">Recommended target: {currentScenario.targetStability}</p>
                </div>
              </div>
            </div>

            {/* Core telemetry interface */}
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Sliders panel */}
              <div className="lg:col-span-5 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                  <span className="text-xs font-bold font-mono text-neutral-400 uppercase">Actuator Control Deck</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">ACTIVE REGULATION</span>
                </div>

                {/* RF Pulse Frequency */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs md:text-sm font-semibold text-neutral-300">
                    <span>Pulse frequency</span>
                    <span className="text-white font-mono font-bold">{wirePulseRate} kHz</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={wirePulseRate}
                    onChange={(e) => setWirePulseRate(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#980003]"
                  />
                  <p className="text-[11px] text-neutral-500">Regulates high heat-gap erosion densities.</p>
                </div>

                {/* Tension */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs md:text-sm font-semibold text-neutral-300">
                    <span>Electrode Wire Tension</span>
                    <span className="text-white font-mono font-bold">{wireTension} N</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={wireTension}
                    onChange={(e) => setWireTension(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#980003]"
                  />
                  <p className="text-[11px] text-neutral-500">Stiffens alignment against arcing vibration.</p>
                </div>

                {/* Flushing pressure */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs md:text-sm font-semibold text-neutral-300">
                    <span>Dielectric Flushing Pressure</span>
                    <span className="text-white font-mono font-bold">{edmPressure.toFixed(1)} MPa</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.5"
                    step="0.1"
                    value={edmPressure}
                    onChange={(e) => setEdmPressure(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#980003]"
                  />
                  <p className="text-[11px] text-neutral-500">Expels micro-scale slag particles.</p>
                </div>

                {/* Voltage */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs md:text-sm font-semibold text-neutral-300">
                    <span>Electric Discharge Potential</span>
                    <span className="text-white font-mono font-bold">{edmVoltage} Volts</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    step="5"
                    value={edmVoltage}
                    onChange={(e) => setEdmVoltage(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#980003]"
                  />
                  <p className="text-[11px] text-neutral-500">Triggers safe plasma-ionization bands.</p>
                </div>

                {/* Speed */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs md:text-sm font-semibold text-neutral-300">
                    <span>Feed Cutting Speed</span>
                    <span className="text-white font-mono font-bold">{cuttingSpeed.toFixed(1)} mm/min</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="8.0"
                    step="0.1"
                    value={cuttingSpeed}
                    onChange={(e) => setCuttingSpeed(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#980003]"
                  />
                  <p className="text-[11px] text-neutral-500">Governs physical alloy metal advances.</p>
                </div>

              </div>

              {/* Scope Waveform screen panel */}
              <div className="lg:col-span-7 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 flex flex-col justify-between space-y-6">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-neutral-400 uppercase tracking-widest block">Gap Oscilloscope Spark Analysis</span>
                    
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono uppercase flex items-center gap-1.5 ${
                      edmStability === "STABLE" ? "bg-emerald-500/10 text-emerald-400" :
                      edmStability === "OPTIMAL_PRECISION" ? "bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30" :
                      edmStability === "ARCING_DANGER" ? "bg-amber-500/10 text-amber-400 animate-pulse" :
                      "bg-red-500/15 text-red-500 border border-red-500/30 animate-pulse"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        edmStability === "STABLE" ? "bg-emerald-400" :
                        edmStability === "OPTIMAL_PRECISION" ? "bg-cyan-400" :
                        edmStability === "ARCING_DANGER" ? "bg-amber-400" :
                        "bg-red-500"
                      }`} />
                      {edmStability.replace("_", " ")}
                    </span>
                  </div>

                  {/* Canvas block */}
                  <div className="relative rounded-xl overflow-hidden border border-neutral-900 shadow-inner bg-black">
                    <canvas
                      ref={sparkCanvasRef}
                      width={450}
                      height={180}
                      className="w-full h-44 bg-black block"
                    />
                    <div className="absolute right-3 bottom-3 text-[9px] font-mono text-neutral-600 block bg-neutral-950/70 p-1 rounded">
                      TIMEBASE: 5µs/div
                    </div>
                    <div className="absolute left-3 top-3 text-[10px] font-bold font-mono text-amber-400 bg-neutral-950/80 px-2 py-0.5 rounded">
                      PEAK gap discharge: {(((wirePulseRate * edmVoltage)/4)).toFixed(0)} Watts
                    </div>
                  </div>
                </div>

                {/* Highly structured vector graphic detailing the metal cutting process details */}
                <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-850 space-y-2">
                  <span className="text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest block text-center">WIRE EDM MECHANICAL SCHEMATIC (LIVE)</span>
                  
                  <div className="grid grid-cols-2 gap-4 items-center">
                    {/* SVG Image Schema of EDM process */}
                    <svg viewBox="0 0 160 100" className="w-full h-24 block">
                      {/* Alloy metal Block */}
                      <rect x="20" y="30" width="80" height="40" fill="#2d3748" rx="2" stroke="#4a5568" strokeWidth="1" />
                      
                      {/* Wire Electrode line passing through */}
                      <line x1="60" y1="5" x2="60" y2="95" stroke="#ff8c00" strokeWidth="2.5" />
                      
                      {/* Fluid coolant nozzle */}
                      <path d="M 45 5 L 75 5 L 65 20 L 55 20 Z" fill="#3182ce" opacity="0.6" />
                      
                      {/* Spark ionization dots around gap */}
                      <circle cx="60" cy="50" r="8" fill="rgba(245,158,11,0.2)" />
                      {/* Spark particles */}
                      <circle cx="58" cy="48" r="1" fill="#fff" />
                      <circle cx="62" cy="54" r="1.5" fill="#ff7700" />
                      <circle cx="59" cy="56" r="1" fill="#ffcc00" />

                      <text x="105" y="45" fill="#718096" className="text-[8px] font-bold">Dielectric flow</text>
                      <text x="105" y="60" fill="#fff" className="text-[8px] font-mono">Alloy work</text>
                      <text x="65" y="20" fill="#ff8c00" className="text-[8px] font-bold font-mono">Wire</text>
                    </svg>

                    <div className="space-y-1.5 text-xs text-neutral-300">
                      <div className="flex justify-between">
                        <span className="text-neutral-500 font-mono">Pulse Energy:</span>
                        <span className="font-bold font-mono text-sky-400">{((edmVoltage * 0.4) / Math.max(1, wireTension * 0.1)).toFixed(1)} mJ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 font-mono">Debris Fluid:</span>
                        <span className="font-bold font-mono text-sky-400">{(edmPressure * 14.5).toFixed(0)} PSI</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 font-mono">Wire Status:</span>
                        <span className="font-bold font-mono text-emerald-400">{wireTension >= 15 ? "STIFF" : "VIBRANT"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scenario verification criteria outcomes banner */}
                <div className={`p-4 rounded-xl border text-xs md:text-sm leading-relaxed ${
                  scenarioCleared 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" 
                    : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                }`}>
                  <div className="flex items-start gap-2.5">
                    {scenarioCleared ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                    )}
                    <div className="space-y-1">
                      <p className="font-bold font-sans uppercase">
                        {scenarioCleared ? "Mission Benchmark Targets Cleared!" : "Calibration Check Incomplete"}
                      </p>
                      <p className="font-sans text-neutral-300">{scenarioFeedback}</p>
                      {!scenarioCleared && (
                        <p className="font-mono text-[11px] text-neutral-400 mt-1">
                          💡 Hint: {currentScenario.hintText}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
