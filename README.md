# 🧾 Invoice Management App

> A full-stack, self-hosted invoice management system built to simplify billing for small businesses — for my parents’ garment business.

---

## 🌟 Project Story

This project started with a real need — my parents run a small-scale garments business.  
I was using Excel to generate invoices, but that process was **time-consuming (15–30 minutes per invoice)** and hard to manage.

So, I decided to build a **custom web app** tailored for our use case — one that’s simple, fast, and intuitive.  
Now, I can generate an invoice in under **5 minutes**, store them securely, and manage companies/clients easily.

---

## 🚀 Features

### 💼 Company Management

-   Add, edit, and delete company profiles (name, GSTIN, address)
-   Stores all client/company details for quick invoice entry

### 🧾 Invoice Management

-   Create and view invoices in 3 easy sections:
    1. **Basic Details**
    2. **Item Details**
    3. **Amount Details**
-   CRUD operations for invoices
-   Print-friendly layout for physical copies

### 🔐 Authentication

-   Simple client-side login to protect data

### 🖼️ User Experience

-   Clean, responsive, SCSS-based UI
-   Toast notifications for actions
-   Smooth printing layout optimized for A4 paper

---

## 🧰 Tech Stack

| Layer        | Technologies                                  |
| ------------ | --------------------------------------------- |
| **Frontend** | Angular, SCSS, Bootstrap                      |
| **Backend**  | Node.js, Express.js, TypeScript               |
| **Database** | MongoDB                                       |
| **Extras**   | Redis (for caching), RxJS, Angular Animations |

---

## 🏗️ Architecture

The project follows a **monolithic full-stack** structure with separate `client` and `server` directories.

## 💡 Highlights

-   Built from real-world need — not a tutorial project
-   Fully functional CRUD for invoices & companies
-   Designed with attention to UX (animations, toaster, responsive design)
-   Optimized printing layout (A4 ready)
-   Reusable components and modular Angular structure

### 🎬 Demo Video

Watch a quick demo of the Invoice App in action: [[Invoice App Demo]](https://drive.google.com/file/d/18TMeOskxJMzq2jF6xlOfqd1PpdGCm8mU/view?usp=sharing)
