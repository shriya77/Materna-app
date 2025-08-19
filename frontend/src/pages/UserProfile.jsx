import React, { useEffect, useState, useRef } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);
import { getAuth, signOut, updateProfile, updateEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import bgVideo from "@/assets/sky1.mp4";
import { StarStill } from "@/components/StarStill";
import { Toaster, toast } from "react-hot-toast";
import editIcon from "@/assets/editing.png";
import babyIcon from "@/assets/baby.png";
import weight from "@/assets/bbweight.png";
import size from "@/assets/bbsize.png";
import calendarIcon from "@/assets/calendar.png";
import clockIcon from "@/assets/clock.png";
import phoneIcon from "@/assets/phone-call.png";
import increaseIcon from "@/assets/increase.png";

export default function UserProfile() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [userData, setUserData] = useState({});
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingJourney, setIsEditingJourney] = useState(false);
  const [growthView, setGrowthView] = useState("today");

  // Growth tracking state
  const [growthData, setGrowthData] = useState({
    weight: 0,
    size: 0,
    currentWeek: 0,
    weeklyChart: [],
    trimesterChart: [],
  });
  // Growth estimation utility functions
  const estimateWeight = (week) => {
    if (week < 4) return 0.01;
    if (week < 13) return 0.1 + 0.02 * week;
    if (week < 28) return 0.2 + 0.1 * (week - 13);
    if (week <= 40) return 1.5 + 0.15 * (week - 28);
    return 3.5;
  };

  const estimateLength = (week) => {
    if (week < 4) return 1;
    if (week < 13) return 5 + week * 0.5;
    if (week < 28) return 10 + (week - 13) * 1;
    if (week <= 40) return 25 + (week - 28) * 1.2;
    return 52;
  };

  useEffect(() => {
    if (userData.dueDate) {
      const today = new Date();
      const due = new Date(userData.dueDate);
      const conception = new Date(due.getTime() - 280 * 24 * 60 * 60 * 1000);
      const diffDays = Math.floor((today - conception) / (1000 * 60 * 60 * 24));
      const week = Math.max(0, Math.min(40, Math.floor(diffDays / 7)));

      const weight = estimateWeight(week);
      const size = estimateLength(week);

      const weeklyChart = Array.from({ length: week + 1 }, (_, w) => ({
        week: w,
        weight: estimateWeight(w),
        size: estimateLength(w),
      }));

      const trimesterChart = [
        {
          label: "Trimester 1",
          avgWeight: estimateWeight(13),
          avgSize: estimateLength(13),
        },
        {
          label: "Trimester 2",
          avgWeight: estimateWeight(28),
          avgSize: estimateLength(28),
        },
        {
          label: "Trimester 3",
          avgWeight: estimateWeight(week),
          avgSize: estimateLength(week),
        },
      ];

      setGrowthData({
        weight,
        size,
        currentWeek: week,
        weeklyChart,
        trimesterChart,
      });
    }
  }, [userData.dueDate]);

  // Appointments state and handlers
  const [appointments, setAppointments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppt, setNewAppt] = useState({ date: "", time: "", doctor: "" });
  // Modal and split view state for appointments
  const [showModal, setShowModal] = useState(false);
  const [viewPast, setViewPast] = useState(false);

  const handleAddAppointment = () => {
    if (newAppt.date && newAppt.time && newAppt.doctor) {
      setAppointments([...appointments, { ...newAppt, done: false }]);
      setNewAppt({ date: "", time: "", doctor: "" });
      setShowAddForm(false);
    }
  };

  const markAsDone = (index) => {
    const updated = [...appointments];
    updated[index].done = true;
    // Use a prompt for notes, but only set if not null
    const note = window.prompt("Add notes about this appointment:");
    if (note !== null) {
      updated[index].notes = note;
    }
    setAppointments(updated);
  };

  const deleteAppointment = (index) => {
    const updated = appointments.filter((_, i) => i !== index);
    setAppointments(updated);
  };

  const fileInputRef = useRef(null);

useEffect(() => {
  let isMounted = true;

  (async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const token = await user.getIdToken(true); // fresh ID token
      const res = await fetch("http://localhost:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`GET /api/profile/ ${res.status}`);

      const data = await res.json();

      if (!isMounted) return;
      // map snake_case from backend -> your camelCase UI fields
      setUserData((prev) => ({
        ...prev,
        ...data,
        name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
        email: data.email ?? prev?.email ?? "",
        phone: data.phone ?? prev?.phone ?? "",
        dob: data.dob ?? prev?.dob ?? "",
        dueDate: data.due_date ?? prev?.dueDate ?? "",
        provider: data.doctor_info ?? prev?.provider ?? "",
      }));
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  })();

  return () => { isMounted = false; };
}, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-center" />
      <video
        autoPlay
        muted
        playsInline
        loop
        className="fixed top-0 left-0 w-full h-screen object-cover -z-20 transition-opacity duration-500 "
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="fixed top-0 left-0 -z-10 h-screen w-full bg-white/40 backdrop-blur-sm"></div>
      <StarStill />
      {/* <div className="fixed top-0 left-0 w-full h-screen bg-white/50 backdrop-blur-sm -z-10"></div> */}
      <main className="min-h-screen bg-transparent px-4 py-6 sm:px-6 md:px-10 font-sans text-[#234451] pt-24 sm:pt-32">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Card */}
          <section className="bg-white/70 backdrop-blur-md shadow-md shadow-purple-100 border border-white/30 rounded-3xl px-4 py-7 sm:px-6 md:px-10 mb-6 flex flex-col items-center">
            <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full">
                <div className="relative group transition-all duration-200">
                  <img
                    src={
                      userData.photo && userData.photo.trim() !== ""
                        ? userData.photo
                        : "https://i.pinimg.com/236x/40/41/6f/40416fe5cfc9de788b1fcd769c93013a.jpg"
                    }
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://i.pinimg.com/236x/40/41/6f/40416fe5cfc9de788b1fcd769c93013a.jpg";
                    }}
                    alt="profile"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-[#a48bc3] shadow-md transition-transform duration-300 cursor-pointer hover:scale-105"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = async () => {
                          const base64 = reader.result;
                          setUserData((prev) => ({
                            ...prev,
                            photo: base64,
                          }));

                          try {
                            await updateProfile(auth.currentUser, {
                              photoURL: base64,
                            });
                          } catch (err) {
                            console.error("Failed to update photo:", err);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide mb-1">
                    Hi {userData.name}!
                  </h1>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {isEditingJourney ? (
                      <>
                        <input
                          type="text"
                          className="bg-white/70 border border-gray-200 text-[#234451] py-2 px-4 rounded-xl text-base font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                          value={userData.tag1 || ""}
                          placeholder="Tag 1"
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              tag1: e.target.value,
                            }))
                          }
                        />
                        <input
                          type="text"
                          className="bg-white/70 border border-gray-200 text-[#234451] py-2 px-4 rounded-xl text-base font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                          value={userData.tag2 || ""}
                          placeholder="Tag 2"
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              tag2: e.target.value,
                            }))
                          }
                        />
                      </>
                    ) : (
                      <>
                        {userData.tag1 && (
                          <span className="bg-[#fbdde3] text-[#b15d6e] px-3 py-1 rounded-full text-sm font-semibold tracking-wide">
                            {userData.tag1}
                          </span>
                        )}
                        {userData.tag2 && (
                          <span className="bg-[#daf5e9] text-[#317e5a] px-3 py-1 rounded-full text-sm font-semibold tracking-wide">
                            {userData.tag2}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex-shrink-0 self-center">
                <button
                  onClick={handleLogout}
                  className="bg-[#a48bc3] text-white text-base px-7 py-2 rounded-full font-semibold shadow-md hover:brightness-110 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {/* Personal Info */}
            <section className="col-span-1 md:col-span-2 lg:col-span-6 bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl shadow-md shadow-purple-100 p-6 flex flex-col space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base sm:text-lg md:text-2xl font-extrabold tracking-wide text-left">
                  Personal Information
                </h2>
                {!isEditingPersonal ? (
                  <img
                    src={editIcon}
                    alt="edit"
                    className="w-7 h-7 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setIsEditingPersonal(true)}
                  />
                ) : (
                  <button
                    className="bg-[#a48bc3] text-white px-6 py-2 rounded-full text-base font-semibold hover:brightness-110 transition-all"
                    onClick={async () => {
                      try {
                        if (auth.currentUser) {
                          const res = await fetch("http://localhost:8000/api/profile/", {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
                            },
                            body: JSON.stringify({
                              first_name: userData.name.split(' ')[0],
                              last_name: userData.name.split(' ').slice(1).join(' '),
                              email: userData.email,
                              dob: userData.dob,
                            }),
                          });
                          if (!res.ok) throw new Error(`PUT /api/profile/ ${res.status}`);

                          // Handle the optional email update with Firebase
                          if (auth.currentUser.email !== userData.email) {
                            await updateEmail(auth.currentUser, userData.email);
                          }
                          toast.success("Changes saved successfully!");
                          setIsEditingPersonal(false);
                        }
                      } catch (error) {
                        console.error("Error updating profile:", error);
                        toast.error("Failed to save changes. Please try again. ");
                      }
                    }}
                  >
                    Save
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col">
                  <label className="text-xs sm:text-base font-semibold mb-1 tracking-wide text-left">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="bg-white/80 border border-gray-200 text-[#234451] py-3 px-4 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                    value={userData.name}
                    readOnly={!isEditingPersonal}
                    onChange={
                      isEditingPersonal
                        ? (e) =>
                            setUserData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                        : undefined
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs sm:text-base font-semibold mb-1 tracking-wide text-left">
                    Email
                  </label>
                  <input
                    type="email"
                    className="bg-white/80 border border-gray-200 text-[#234451] py-3 px-4 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                    value={userData.email}
                    readOnly={!isEditingPersonal}
                    onChange={
                      isEditingPersonal
                        ? (e) =>
                            setUserData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                        : undefined
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs sm:text-base font-semibold mb-1 tracking-wide text-left">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="bg-white/80 border border-gray-200 text-[#234451] py-3 px-4 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                    value={userData.phone || ""}
                    readOnly={!isEditingPersonal}
                    onChange={
                      isEditingPersonal
                        ? (e) =>
                            setUserData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                        : undefined
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs sm:text-base font-semibold mb-1 tracking-wide text-left">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="bg-white/80 border border-gray-200 text-[#234451] py-3 px-4 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                    value={userData.dob || ""}
                    readOnly={!isEditingPersonal}
                    onChange={
                      isEditingPersonal
                        ? (e) =>
                            setUserData((prev) => ({
                              ...prev,
                              dob: e.target.value,
                            }))
                        : undefined
                    }
                  />
                </div>
              </div>
            </section>

            {/* Maternal Journey */}
            <section className="col-span-1 md:col-span-2 lg:col-span-6 bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl shadow-md shadow-purple-100 p-6 flex flex-col space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base sm:text-lg md:text-2xl font-extrabold tracking-wide text-left">
                  Maternal Journey
                </h2>
                {!isEditingJourney ? (
                  <img
                    src={editIcon}
                    alt="edit"
                    className="w-7 h-7 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setIsEditingJourney(true)}
                  />
                ) : (
                  <button
                    className="bg-[#a48bc3] text-white px-6 py-2 rounded-full text-base font-semibold hover:brightness-110 transition-all"
                    onClick={async () => {
                      try {
                        const res = await fetch("http://localhost:8000/api/profile/", {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
                          },
                          body: JSON.stringify({
                            status: userData.status,
                            due_date: userData.dueDate,
                            doctor_info: userData.provider,
                            emergency: userData.emergency,
                            partner_email: userData.partnerEmail,
                            tag1: userData.tag1, // Tag 1 and 2 are in the "Maternal Journey" section
                            tag2: userData.tag2,
                          }),
                        });
                        if (!res.ok) throw new Error(`PUT /api/profile/ ${res.status}`);

                        toast.success("Changes saved successfully!");
                        setIsEditingJourney(false);
                      } catch (error) {
                        console.error("Error saving changes:", error);
                        toast.error("Failed to save changes. Please try again.");
                      }
                    }}
                  >
                    Save
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col">
                  <label className="text-xs sm:text-base font-semibold mb-1 tracking-wide text-left">
                    Status
                  </label>
                  <select
                    className="bg-white/80 border border-gray-200 text-[#234451] py-3 px-4 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                    value={userData.status || ""}
                    disabled={!isEditingJourney}
                    onChange={
                      isEditingJourney
                        ? (e) =>
                            setUserData((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }))
                        : undefined
                    }
                  >
                    <option>Pregnant</option>
                    <option>Postpartum</option>
                    <option>Trying to Conceive</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs sm:text-base font-semibold mb-1 tracking-wide text-left">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="bg-white/80 border border-gray-200 text-[#234451] py-3 px-4 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                    value={userData.dueDate || ""}
                    readOnly={!isEditingJourney}
                    onChange={
                      isEditingJourney
                        ? (e) =>
                            setUserData((prev) => ({
                              ...prev,
                              dueDate: e.target.value,
                            }))
                        : undefined
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs sm:text-base font-semibold mb-1 tracking-wide text-left">
                    Healthcare Provider
                  </label>
                  <input
                    type="text"
                    className="bg-white/80 border border-gray-200 text-[#234451] py-3 px-4 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                    value={userData.provider || ""}
                    readOnly={!isEditingJourney}
                    onChange={
                      isEditingJourney
                        ? (e) =>
                            setUserData((prev) => ({
                              ...prev,
                              provider: e.target.value,
                            }))
                        : undefined
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs sm:text-base font-semibold mb-1 tracking-wide text-left">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    className="bg-white/80 border border-gray-200 text-[#234451] py-3 px-4 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                    value={userData.emergency || ""}
                    readOnly={!isEditingJourney}
                    onChange={
                      isEditingJourney
                        ? (e) =>
                            setUserData((prev) => ({
                              ...prev,
                              emergency: e.target.value,
                            }))
                        : undefined
                    }
                  />
                </div>
                {/* Partner Access Section */}
                <div className="flex flex-col">
                  <label className="text-xs sm:text-base font-semibold mb-1 tracking-wide text-left">
                    Partner Email
                  </label>
                  <input
                    type="email"
                    className="bg-white/80 border border-gray-200 text-[#234451] py-3 px-4 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                    value={userData.partnerEmail || ""}
                    readOnly={!isEditingJourney}
                    onChange={
                      isEditingJourney
                        ? (e) =>
                            setUserData((prev) => ({
                              ...prev,
                              partnerEmail: e.target.value,
                            }))
                        : undefined
                    }
                  />
                  <p className="text-xs text-[#555] mt-1 text-left">
                    Your partner can log in using this email to view shared data
                    like symptom charts, vaccine reminders, appointments, and
                    milestones.
                  </p>
                </div>
              </div>
            </section>

            {/* Row for Preferences, Upcoming Appointments, Growth Tracker */}
            {/* Stacked on mobile/tablet, row on lg+ */}
            {/* Mobile/Tablet stacked */}
            <section className="block lg:hidden col-span-1 md:col-span-2 lg:col-span-6">
              {/* Preferences */}
              <section className="mb-6 bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl shadow-md shadow-purple-100 p-6 flex flex-col space-y-4">
                <h2 className="font-semibold text-base sm:text-lg md:text-2xl tracking-wide mb-3">
                  Preferences
                </h2>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex items-center justify-between">
                    <span>Daily Reminders</span>
                    <input
                      type="checkbox"
                      className="toggle accent-[#a48bc3]"
                      checked
                      readOnly
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email Updates</span>
                    <input
                      type="checkbox"
                      className="toggle accent-[#a48bc3]"
                      checked
                      readOnly
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Community Notifications</span>
                    <input
                      type="checkbox"
                      className="toggle accent-[#a48bc3]"
                      readOnly
                    />
                  </div>
                  {/* Language Dropdown */}
                  <div className="flex flex-col mt-4">
                    <label
                      htmlFor="language"
                      className="text-xs sm:text-base font-semibold mb-1 tracking-wide text-left"
                    >
                      Language
                    </label>
                    <select
                      id="language"
                      className="bg-white/80 border border-gray-200 text-[#234451] py-3 px-4 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                      value={localStorage.getItem("i18nextLng") || "en"}
                      onChange={(e) => {
                        localStorage.setItem("i18nextLng", e.target.value);
                        window.location.reload();
                      }}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="hi">Hindi</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                </div>
              </section>
              {/* Upcoming Appointments */}
              <section className="mb-6 bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl shadow-md shadow-purple-100 p-6 flex flex-col space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-base sm:text-lg md:text-2xl tracking-wide">
                    {viewPast ? "Past Appointments" : "Upcoming Appointments"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-xs underline text-[#234451] hover:brightness-110"
                      onClick={() => setViewPast(!viewPast)}
                    >
                      {viewPast ? "View Upcoming" : "View Past"}
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-[#a48bc3] text-2xl leading-none hover:scale-105 hover:text-[#745295] transition-all font-extrabold"
                      title="Add Appointment"
                    >
                      +
                    </button>
                  </div>
                </div>
                {(viewPast
                  ? appointments.filter((a) => a.done)
                  : appointments.filter((a) => !a.done)
                ).length === 0 ? (
                  <p className="text-sm text-[#666]">
                    No {viewPast ? "past" : "upcoming"} appointments
                  </p>
                ) : (
                  (viewPast
                    ? appointments.filter((a) => a.done)
                    : appointments.filter((a) => !a.done)
                  ).map((appt, idx) => (
                    <div
                      key={idx}
                      className="bg-white/90 border border-gray-200 text-[#234451] rounded-2xl p-4 shadow-md mb-3 flex flex-col transition-transform hover:scale-105"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-base font-semibold tracking-wide">
                            {appt.doctor}
                          </p>
                          <p className="text-sm">
                            {appt.date} at {appt.time}
                          </p>
                          {appt.notes && (
                            <p className="text-xs mt-1 text-[#555] italic">
                              {appt.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {!appt.done && (
                            <button
                              onClick={() => markAsDone(idx)}
                              className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold transition-all hover:brightness-110"
                            >
                              Done
                            </button>
                          )}
                          <button
                            onClick={() => deleteAppointment(idx)}
                            className="text-xs bg-[#fabdb5] text-[#234451] px-3 py-1 rounded-full font-semibold hover:bg-[#dfa69f] transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {showModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white/90 p-6 rounded-3xl w-[95%] sm:max-w-md shadow-xl transition-transform transform scale-100">
                      <h3 className="text-lg sm:text-xl font-extrabold mb-4 text-[#234451] tracking-wide">
                        Add Appointment
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="date"
                          className="w-full py-3 px-4 border border-gray-300 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                          value={newAppt.date}
                          onChange={(e) =>
                            setNewAppt({ ...newAppt, date: e.target.value })
                          }
                        />
                        <input
                          type="time"
                          className="w-full py-3 px-4 border border-gray-300 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                          value={newAppt.time}
                          onChange={(e) =>
                            setNewAppt({ ...newAppt, time: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Doctor's Name"
                          className="w-full py-3 px-4 border border-gray-300 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                          value={newAppt.doctor}
                          onChange={(e) =>
                            setNewAppt({ ...newAppt, doctor: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => setShowModal(false)}
                          className="text-base text-[#666] hover:underline"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleAddAppointment();
                            setShowModal(false);
                          }}
                          className="bg-[#a48bc3] text-white px-6 py-2 rounded-full text-base font-semibold hover:brightness-110 transition-all"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
              {/* Growth Tracker */}
              <section className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg shadow-purple-100 text-[#234451] flex flex-col">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide text-[#6f4fa1] mb-4">
                  Growth Tracker
                </h2>
                <div className="flex flex-wrap justify-start gap-3 sm:gap-6 mb-4">
                  {["today", "weekly", "trimester"].map((view) => (
                    <button
                      key={view}
                      className={`${
                        growthView === view
                          ? "bg-[#a48bc3] text-white"
                          : "bg-[#e8d8f8] text-[#6f4fa1]"
                      } text-base font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition-all`}
                      onClick={() => setGrowthView(view)}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-center">
                  {/* Illustration */}
                  <div className="col-span-1 flex justify-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-[#e8d8f8] via-[#faf3f8] to-[#fabdb5]/40 flex items-center justify-center relative max-w-full shadow-md">
                      <img
                        src={babyIcon}
                        alt="Fetus"
                        className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
                      />
                    </div>
                  </div>
                  {/* Metrics */}
                  <div className="col-span-2 grid grid-cols-1 xs:grid-cols-2 gap-4">
                    {/* Weight */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow border border-white/30 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/80 p-3 rounded-2xl shadow">
                          <img
                            src={weight}
                            alt="Weight"
                            className="w-7 h-7 sm:w-8 sm:h-8"
                          />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-[#444] tracking-wide">
                            Weight
                          </p>
                          <p className="text-xl sm:text-2xl font-extrabold text-[#234451] tracking-wide">
                            {growthData.weight.toFixed(2)} kg
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-[#f87171] font-semibold flex items-center">
                        <img
                          src={increaseIcon}
                          alt="Increase"
                          className="w-3 h-3 inline mr-1"
                        />
                        3.6%
                      </p>
                    </div>
                    {/* Size */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow border border-white/30 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/80 p-3 rounded-2xl shadow">
                          <img
                            src={size}
                            alt="Size"
                            className="w-7 h-7 sm:w-8 sm:h-8"
                          />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-[#444] tracking-wide">
                            Size
                          </p>
                          <p className="text-xl sm:text-2xl font-extrabold text-[#234451] tracking-wide">
                            {growthData.size.toFixed(1)} cm
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-[#f87171] font-semibold flex items-center">
                        <img
                          src={increaseIcon}
                          alt="Increase"
                          className="w-3 h-3 inline mr-1"
                        />
                        3.6%
                      </p>
                    </div>
                  </div>
                </div>
                {/* Charts for weekly and trimester views */}
                {growthView === "weekly" && (
                  <div className="mt-8 overflow-x-auto border border-white/30 rounded-2xl shadow-md bg-white/80 p-4">
                    <Line
                      data={{
                        labels: growthData.weeklyChart.map(
                          (d) => `Week ${d.week}`,
                        ),
                        datasets: [
                          {
                            label: "Weight (kg)",
                            data: growthData.weeklyChart.map((d) => d.weight),
                            borderColor: "#a48bc3",
                            backgroundColor: "rgba(164,139,195,0.2)",
                            tension: 0.4,
                            fill: true,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: true } },
                      }}
                    />
                  </div>
                )}
                {growthView === "trimester" && (
                  <div className="mt-8 overflow-x-auto border border-white/30 rounded-2xl shadow-md bg-white/80 p-4">
                    <Bar
                      data={{
                        labels: growthData.trimesterChart.map((d) => d.label),
                        datasets: [
                          {
                            label: "Avg Weight (kg)",
                            data: growthData.trimesterChart.map(
                              (d) => d.avgWeight,
                            ),
                            backgroundColor: "#a48bc3",
                          },
                          {
                            label: "Avg Size (cm)",
                            data: growthData.trimesterChart.map(
                              (d) => d.avgSize,
                            ),
                            backgroundColor: "#6f4fa1",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: true } },
                      }}
                    />
                  </div>
                )}
              </section>
            </section>
            {/* Desktop (lg+) row */}
            <div className="hidden lg:flex w-full gap-6 col-span-6">
              {/* Preferences */}
              <section className="w-[25%] bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl shadow-md shadow-purple-100 p-6 flex flex-col space-y-4">
                <h2 className="font-semibold text-base sm:text-lg md:text-2xl tracking-wide mb-3">
                  Preferences
                </h2>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex items-center justify-between">
                    <span>Daily Reminders</span>
                    <input
                      type="checkbox"
                      className="toggle accent-[#a48bc3]"
                      checked
                      readOnly
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email Updates</span>
                    <input
                      type="checkbox"
                      className="toggle accent-[#a48bc3]"
                      checked
                      readOnly
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Community Notifications</span>
                    <input
                      type="checkbox"
                      className="toggle accent-[#a48bc3]"
                      readOnly
                    />
                  </div>
                  {/* Language Dropdown */}
                  <div className="flex flex-col mt-4">
                    <label
                      htmlFor="language"
                      className="text-xs sm:text-base font-semibold mb-1 tracking-wide text-left"
                    >
                      Language
                    </label>
                    <select
                      id="language"
                      className="bg-white/80 border border-gray-200 text-[#234451] py-3 px-4 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                      value={localStorage.getItem("i18nextLng") || "en"}
                      onChange={(e) => {
                        localStorage.setItem("i18nextLng", e.target.value);
                        window.location.reload();
                      }}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="hi">Hindi</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                </div>
              </section>
              {/* Upcoming Appointments */}
              <section className="w-[25%] bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl shadow-md shadow-purple-100 p-6 flex flex-col space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-base sm:text-lg md:text-2xl tracking-wide">
                    {viewPast ? "Past Appointments" : "Upcoming Appointments"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-xs underline text-[#234451] hover:brightness-110"
                      onClick={() => setViewPast(!viewPast)}
                    >
                      {viewPast ? "View Upcoming" : "View Past"}
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-[#a48bc3] text-2xl leading-none hover:scale-105 hover:text-[#745295] transition-all font-extrabold"
                      title="Add Appointment"
                    >
                      +
                    </button>
                  </div>
                </div>
                {(viewPast
                  ? appointments.filter((a) => a.done)
                  : appointments.filter((a) => !a.done)
                ).length === 0 ? (
                  <p className="text-sm text-[#666]">
                    No {viewPast ? "past" : "upcoming"} appointments
                  </p>
                ) : (
                  (viewPast
                    ? appointments.filter((a) => a.done)
                    : appointments.filter((a) => !a.done)
                  ).map((appt, idx) => (
                    <div
                      key={idx}
                      className="bg-white/90 border border-gray-200 text-[#234451] rounded-2xl p-4 shadow-md mb-3 flex flex-col transition-transform hover:scale-105"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-base font-semibold tracking-wide">
                            {appt.doctor}
                          </p>
                          <p className="text-sm">
                            {appt.date} at {appt.time}
                          </p>
                          {appt.notes && (
                            <p className="text-xs mt-1 text-[#555] italic">
                              {appt.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {!appt.done && (
                            <button
                              onClick={() => markAsDone(idx)}
                              className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold transition-all hover:brightness-110"
                            >
                              Done
                            </button>
                          )}
                          <button
                            onClick={() => deleteAppointment(idx)}
                            className="text-xs bg-[#fabdb5] text-[#234451] px-3 py-1 rounded-full font-semibold hover:bg-[#dfa69f] transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {showModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white/90 p-6 rounded-3xl w-[95%] sm:max-w-md shadow-xl transition-transform transform scale-100">
                      <h3 className="text-lg sm:text-xl font-extrabold mb-4 text-[#234451] tracking-wide">
                        Add Appointment
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="date"
                          className="w-full py-3 px-4 border border-gray-300 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                          value={newAppt.date}
                          onChange={(e) =>
                            setNewAppt({ ...newAppt, date: e.target.value })
                          }
                        />
                        <input
                          type="time"
                          className="w-full py-3 px-4 border border-gray-300 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                          value={newAppt.time}
                          onChange={(e) =>
                            setNewAppt({ ...newAppt, time: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Doctor's Name"
                          className="w-full py-3 px-4 border border-gray-300 rounded-xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a48bc3] transition-all"
                          value={newAppt.doctor}
                          onChange={(e) =>
                            setNewAppt({ ...newAppt, doctor: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => setShowModal(false)}
                          className="text-base text-[#666] hover:underline"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleAddAppointment();
                            setShowModal(false);
                          }}
                          className="bg-[#a48bc3] text-white px-6 py-2 rounded-full text-base font-semibold hover:brightness-110 transition-all"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
              {/* Growth Tracker */}
              <section className="w-[50%] bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg shadow-purple-100 text-[#234451] flex flex-col">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide text-[#6f4fa1] mb-4">
                  Growth Tracker
                </h2>
                <div className="flex flex-wrap justify-start gap-3 sm:gap-6 mb-4">
                  {["today", "weekly", "trimester"].map((view) => (
                    <button
                      key={view}
                      className={`${
                        growthView === view
                          ? "bg-[#a48bc3] text-white"
                          : "bg-[#e8d8f8] text-[#6f4fa1]"
                      } text-base font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition-all`}
                      onClick={() => setGrowthView(view)}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-center">
                  {/* Illustration */}
                  <div className="col-span-1 flex justify-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-[#e8d8f8] via-[#faf3f8] to-[#fabdb5]/40 flex items-center justify-center relative max-w-full shadow-md">
                      <img
                        src={babyIcon}
                        alt="Fetus"
                        className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
                      />
                    </div>
                  </div>
                  {/* Metrics */}
                  <div className="col-span-2 grid grid-cols-1 xs:grid-cols-2 gap-4">
                    {/* Weight */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow border border-white/30 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/80 p-3 rounded-2xl shadow">
                          <img
                            src={weight}
                            alt="Weight"
                            className="w-7 h-7 sm:w-8 sm:h-8"
                          />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-[#444] tracking-wide">
                            Weight
                          </p>
                          <p className="text-xl sm:text-2xl font-extrabold text-[#234451] tracking-wide">
                            {growthData.weight.toFixed(2)} kg
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-[#f87171] font-semibold flex items-center">
                        <img
                          src={increaseIcon}
                          alt="Increase"
                          className="w-3 h-3 inline mr-1"
                        />
                        3.6%
                      </p>
                    </div>
                    {/* Size */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow border border-white/30 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/80 p-3 rounded-2xl shadow">
                          <img
                            src={size}
                            alt="Size"
                            className="w-7 h-7 sm:w-8 sm:h-8"
                          />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-[#444] tracking-wide">
                            Size
                          </p>
                          <p className="text-xl sm:text-2xl font-extrabold text-[#234451] tracking-wide">
                            {growthData.size.toFixed(1)} cm
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-[#f87171] font-semibold flex items-center">
                        <img
                          src={increaseIcon}
                          alt="Increase"
                          className="w-3 h-3 inline mr-1"
                        />
                        3.6%
                      </p>
                    </div>
                  </div>
                </div>
                {/* Charts for weekly and trimester views */}
                {growthView === "weekly" && (
                  <div className="mt-8 overflow-x-auto border border-white/30 rounded-2xl shadow-md bg-white/80 p-4">
                    <Line
                      data={{
                        labels: growthData.weeklyChart.map(
                          (d) => `Week ${d.week}`,
                        ),
                        datasets: [
                          {
                            label: "Weight (kg)",
                            data: growthData.weeklyChart.map((d) => d.weight),
                            borderColor: "#a48bc3",
                            backgroundColor: "rgba(164,139,195,0.2)",
                            tension: 0.4,
                            fill: true,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: true } },
                      }}
                    />
                  </div>
                )}
                {growthView === "trimester" && (
                  <div className="mt-8 overflow-x-auto border border-white/30 rounded-2xl shadow-md bg-white/80 p-4">
                    <Bar
                      data={{
                        labels: growthData.trimesterChart.map((d) => d.label),
                        datasets: [
                          {
                            label: "Avg Weight (kg)",
                            data: growthData.trimesterChart.map(
                              (d) => d.avgWeight,
                            ),
                            backgroundColor: "#a48bc3",
                          },
                          {
                            label: "Avg Size (cm)",
                            data: growthData.trimesterChart.map(
                              (d) => d.avgSize,
                            ),
                            backgroundColor: "#6f4fa1",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: true } },
                      }}
                    />
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
      <div className="mt-16 text-center text-xs text-[hsl(var(--foreground))] px-4 max-w-2xl mx-auto">
        <p className="italic leading-relaxed">
          <strong className="block mb-1 text-red-500">DISCLAIMER</strong>
          Materna is currently in early-stage development and is not intended
          for clinical use. <br />
          We do not collect, store, or process any Protected Health Information
          (PHI). <br />
          This platform is for educational and demonstration purposes only and
          is not HIPAA-compliant at this time. <br />
          Please do not submit any personal or health-related data.
        </p>
      </div>
      <div className="text-center mt-10 mb-6">
        <button
          onClick={async () => {
            if (
              window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone.",
              )
            ) {
              try {
                await auth.currentUser.delete();
                toast.success("Account deleted successfully.");
                navigate("/");
              } catch (error) {
                console.error("Error deleting account:", error);
                toast.error(
                  "Error deleting account. Please re-authenticate and try again.",
                );
              }
            }
          }}
          className="text-xs sm:text-sm text-[#234451] px-5 py-2 rounded-full bg-[#fabdb5]/90 hover:brightness-110 transition-all font-semibold"
        >
          Delete Account
        </button>
      </div>
      <Footer />
    </>
  );
}
