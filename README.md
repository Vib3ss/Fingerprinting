# Reinventing Access Control: Fingerprinting for Credential Protection

A modern, privacy-conscious approach to access control that uses **resilient device/browser fingerprinting** as a secondary authentication layer — especially in cases of credential compromise (e.g., phishing attacks).

This project enhances and expands the fingerprinting capabilities from existing tools like [supercookie](https://github.com/jonasstrehle/supercookie) and [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs), building towards a more robust, persistent, and evasive-resistant fingerprinting stack.

>  **Status**: Work In Progress – Contributions, feedback, and testing are welcome.

---

## Key Features

* **Favicon-Based Supercookie Fixes & Improvements**
* **Audio Fingerprinting** via Web Audio API
* **GPU Fingerprinting** using WebGL renderer metrics
* **Math Fingerprinting** using floating-point inconsistencies
* **Improved Entropy & Collision Resistance**
* **Demo videos available in each subfolder** for easier understanding

---

## 📢 Presented & Accepted At

This research and its variants have been accepted at several leading security conferences:

### ✅ **Accepted Talks**

* 🛡️ **VulnCon 2025**
  *\[Reinventing Access Control – Fingerprinting for Credential Protection]*
  🔗 [View Talk](https://vulncon.in/events/vulncon2025/talks/reinventing-access-control)

* 🔓 **BSides Mumbai 2025**
  🔗 [Speaker Profile](https://www.bsidesmumbai.in/speakers)

---

### 🏆 Also Accepted At

> *(Similar or extended versions of this work)*

* **Nullcon Goa**
* **Black Hat MEA**
* **HackRed-Con**
* **BSides Bloomington**
* **BSides Sydney**
* **BSides Connecticut**

---

---

## Project Structure

```
/
├── Favicon/            # Favicon-based supercookie (enhanced)
├── fingerprint/              # Fingerprinting modules
└── README.md
```

Each subfolder includes:

* Source code
* A sample demo
* A demo video illustrating the fingerprinting in action

---

## Motivation

Credential-based authentication is **not enough** in the face of phishing and session hijacking. This project explores **hardware and rendering-level fingerprinting** techniques to:

* Detect unknown/untrusted devices even after credential entry
* Add a passive verification layer with minimal friction
* Identify anomalies in real-time access requests

---

## Credits & Inspiration

* [supercookie](https://github.com/jonasstrehle/supercookie) by Jonas Strehle
* [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs)

This project builds upon their work, fixes some known issues, and expands the fingerprinting vectors used.

---

## Roadmap

* [x] Favicon entropy bug fix & decoding cleanup
* [x] Audio fingerprinting across browsers
* [x] GPU & Math fingerprints
* [ ] Combine multiple signals into a composite hash
* [ ] UI for centralized fingerprint dashboard
* [ ] Integrate with session-based access control logic
* [ ] Privacy controls and mitigation documentation

---

## Usage

Each folder can be run independently. Open the `index.html` in a modern browser. For testing fingerprint stability:

1. Run the demo multiple times
2. Try private/incognito mode
3. Try from different browser profiles/devices

---

## Disclaimer

This project is for **educational and research purposes only**. Use responsibly. The goal is to promote **security and transparency**, not surveillance.

