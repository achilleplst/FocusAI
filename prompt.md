# FOCUSAI
## Identité Visuelle Globale

**Palette :**
- Fond principal : `#F5F3EF` (blanc chaud légèrement froid)
- Fond sombre : `#141210` (charbon profond)
- Accent principal : `#1B3A6B` (bleu marine FocusAI)
- Accent secondaire : `#2563A8` (bleu électrique)
- Or / Highlight : `#F59E0B` (ambre doré)
- Texte secondaire : `#5A5450`

**Typographie :**
- Titres : `Cormorant Garamond` — serif élégant, fin (weight 300), italique pour les emphases
- Corps : `DM Sans` — weight 200–300
- Labels / Caps : `Letter-spacing: 0.18em`, `text-transform: uppercase`, `font-size: 11px`

**Curseur personnalisé :**
- Point central `8px` + cercle suiveur `32px` en `mix-blend-mode: multiply`
- Le cercle s'agrandit (`scale 1.8`) et se remplit au survol des éléments cliquables

**Scroll :**
- Comportement : `scroll-behavior: smooth`
- Chaque section révèle ses éléments via `IntersectionObserver` (apparition au scroll)

---

## Navigation

**Logo :** FOCUSAI — `Cormorant Garamond`, `letter-spacing: 0.3em`, `font-size: 22px`

**Liens :** Solutions · Méthode · Références · Tarifs · Contact

**CTA nav :** [ Audit Gratuit ↗ ] — bouton borderé, remplissage au hover

**Style :**
- Position : `fixed`, `padding: 28px 60px`
- Fond : transparent → `backdrop-filter: blur(12px)` + fond semi-transparent au scroll
- `mix-blend-mode: multiply` pour fusion naturelle avec le hero
- Liens en `opacity: 0.7` → `1` au survol (`transition: 0.3s`)

> **Animation nav :** Apparition en `translateY(-20px) → 0` + `opacity 0 → 1` au chargement (`delay: 0.2s`)

---

## 1. Hero Section

**Titre :** Engineered for Real Estate
**Texte gauche :** Conçu pour les agences immobilières qui refusent de perdre du temps sur des tâches que l'IA peut faire à leur place.
**Texte droite :** Des systèmes sur mesure qui s'intègrent à vos CRM existants — Apimo, Netty, Modelo — et automatisent ce qui vous coûte le plus cher : votre temps.
**CTA :** [ Démarrer l'audit ↗ ]

**Layout :**
- Hauteur : `100vh`
- Fond : gradient sombre `#0A1628 → #1B3A6B → #2563A8` avec Ken Burns `scale(1.08) → scale(1)` sur `14s ease-out`
- Overlay grille géométrique fine en `rgba(245,158,11,0.06)` — pattern `60px × 60px`
- Orbes flous animées en position absolue pour la profondeur
- Grille 3 colonnes : texte gauche / CTA centré / texte droite — alignés en bas
- Overlay gradient : `linear-gradient(to top, rgba(10,18,40,0.7), transparent 55%)`

> **Animations :**
> - Titre : `translateY(40px) opacity:0` → visible sur `1.2s cubic-bezier(0.16,1,0.3,1)` — `delay: 0.3s`
> - Textes gauche/droite : `translateY(20px) opacity:0` → visible sur `1s` — `delay: 0.6s`
> - CTA : `opacity:0` → `1` sur `0.8s` — `delay: 0.9s`
> - CTA hover : fond qui se remplit de gauche à droite en `#F59E0B` (`::before` slide `clip-path`)

---

## 2. Piliers et Intégrations

**Nos Piliers :**
* 01 — AUTOMATISATION CRM
* 02 — QUALIFICATION IA
* 03 — INFRASTRUCTURE SUR MESURE

**Intégrations compatibles (marquee) :**
Apimo · Netty · Modelo · Powimo · HappyMo · Gimini · LeBonCoin · SeLoger · N8N · Make · Airtable · WhatsApp API · Twilio · 360dialog

**Style :**
- Fond : `#F5F3EF`
- Piliers : numéro en `Cormorant Garamond` italique `44px` couleur `#F59E0B` + label `DM Sans 11px caps`
- Intégrations : `opacity: 0.30`, espacement généreux, `letter-spacing: 0.2em`
- Séparateur fin `1px` entre piliers et intégrations

> **Animations :**
> - Piliers : apparition en cascade `staggered` (`delay: 0.1s` entre chaque) via `IntersectionObserver`
> - Intégrations : défilement horizontal infini (`marquee`) en `CSS animation: scroll-left 30s linear infinite`

---

## 3. Déclaration Centrale

**Titre central :** Construit autour des vraies contraintes des agents immobiliers — et de ce qu'ils n'ont pas le temps de faire.
**Sous-titre :** Chaque système est livré testé, documenté et opérationnel.

**Style :**
- Titre en `Cormorant Garamond` `clamp(48px, 6vw, 90px)` centré
- Largeur max : `900px`, marges auto
- Sous-titre : `DM Sans 12px`, `letter-spacing: 0.15em`, `opacity: 0.5`, centré

**Visuel stat pleine largeur :**
- Fond gradient sombre `#1B3A6B → #0A1628`, hauteur `60vh`
- Chiffre géant en transparence : `98%` — `Cormorant Garamond`, `opacity: 0.06`, `clamp(100px, 18vw, 220px)`
- Label bas de page : "Taux de satisfaction client — systèmes livrés clé en main"

> **Animations :**
> - Titre : chaque mot apparaît séquentiellement (`word reveal` via `overflow:hidden` + `translateY`)
> - Visuel stat : `scale(1.04) → scale(1)` au scroll via `IntersectionObserver`
> - Ligne décorative ambre : `width: 0 → 60px` avant le sous-titre (`transition: 1.2s ease`)

---

## 4. La Science de l'Automatisation

**Titre :** The Science of Real Estate Automation
**Tag :** ( MÉTHODE )

**Corps :** Chaque décision d'architecture sert un objectif opérationnel concret. On élimine le superflu — aucun outil générique, aucune solution préfabriquée. Les systèmes sont construits module par module, testés en conditions réelles, et maintenus dans la durée.

**CTA :** [ Voir les modules ↗ ]

**Catalogue Modules :**
* 01 — Relance Acquéreurs Automatisée · 7 jours
* 02 — Qualification Leads Portails · 48h
* 03 — Agent Vocal Locataires · 21 jours
* 04 — Conformité & Gel des Avoirs · 10 secondes
* 05 — Réactivation Base CRM · 90 jours

**Style :**
- Layout 2 colonnes : texte à gauche / catalogue à droite
- Tag `( MÉTHODE )` : `11px caps`, `letter-spacing: 0.3em`, `opacity: 0.4`
- Catalogue : ligne `1px` entre chaque module, numéro en `Cormorant Garamond` italique ambre
- Délai affiché en `DM Sans 11px` gris à droite de chaque ligne

> **Animations :**
> - Texte : `translateX(-30px) opacity:0` → visible au scroll
> - Catalogue : lignes révélées une à une (`stagger 0.15s`)
> - Module hover : ligne `width: 0 → 100%` sous le titre (`::after underline`)
> - Compteur animé : `0 → 7`, `0 → 48`, etc. quand la section entre dans le viewport

---

## 5. Galerie Stats (Section Sombre)

**Thème :** Sombre `#141210`
**Layout :** 2 colonnes côte à côte pleine hauteur `75vh`

**Colonne gauche :**
- Fond : gradient `#0A1628 → #1B3A6B`
- Séparateur vertical `1px rgba(245,243,239,0.06)` à droite
- Label : CLIENTS ACTIFS
- Stat : `8+ agences accompagnées` — `Cormorant Garamond` `clamp(40px, 5vw, 72px)` blanc, italique ambre sur le chiffre

**Colonne droite :**
- Fond : `#141210`
- Label : PROJETS LIVRÉS
- Stat : `100% sur mesure` — même typographie, italique ambre sur la valeur
- Chiffre décoratif `100%` en fond, `opacity: 0.04`, `200px`

> **Animations :**
> - Stats : `translateY(20px) opacity:0` → visible en cascade (`delay: 0.15s`)
> - Chiffres décoratifs de fond : zoom très lent `scale(1.02)` sur `20s` en boucle infinie

---

## 6. Ingénierie de Précision

**Thème :** Sombre `#141210`
**Titre :** Precision Engineering
**Référence :** SPEC_FocusAI_2026

**Modules (colonne gauche) :**
* 01 — Relance Acquéreurs Automatisée
* 02 — Qualification Leads Portails
* 03 — Agent Vocal IA Locataires
* 04 — Réactivation Base CRM
* 05 — Conformité & Gel des Avoirs

**Stack Technique (colonne droite) :**
* **N8N · Make · Airtable** — orchestration des workflows
* **Claude API (Anthropic)** — intelligence et personnalisation des messages
* **Twilio Voice + 360dialog WhatsApp** — canaux de communication multimodaux
* **Apimo · Netty · Modelo · Powimo** — intégrations CRM natives
* **Maintenance incluse** — support direct, mises à jour garanties

**Style :**
- Fond sombre `#141210`, texte `





