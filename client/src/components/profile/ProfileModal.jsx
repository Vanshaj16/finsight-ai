import { useEffect, useMemo, useState } from "react";
import { Camera, PencilLine, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", profilePic: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !isOpen) {
      return;
    }

    setForm({
      name: user.name || "",
      email: user.email || "",
      profilePic: user.profilePic || "",
    });
    setMessage("");
    setError("");
  }, [user, isOpen]);

  const initials = useMemo(() => {
    const source = form.name || user?.name || user?.email || "U";
    return source.trim().charAt(0).toUpperCase();
  }, [form.name, user]);

  if (!isOpen || !user) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        profilePic: form.profilePic,
      });
      window.dispatchEvent(new Event("notifications:refresh"));
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update your profile right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden bg-black/65 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6">
      <div className="card-surface profile-modal-scroll relative w-full max-w-lg overflow-y-auto text-white sm:max-w-2xl">
        <div className="sticky top-3 z-10 mb-3 flex justify-end px-4 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-[rgba(7,9,16,0.78)] p-2 text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-5 sm:px-6 sm:pb-6 lg:px-7 lg:pb-7">
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[220px_1fr] lg:items-start">
            <div className="rounded-[28px] border border-white/8 bg-white/4 p-4 text-center sm:p-5">
            <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-gradient-to-br from-[#6C63FF] to-[#4F9CFF] text-2xl font-semibold text-white shadow-[0_18px_40px_rgba(79,156,255,0.26)] sm:h-24 sm:w-24 sm:text-3xl">
              {form.profilePic ? (
                <img src={form.profilePic} alt={form.name || user.name} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <p className="mt-4 break-words text-base font-semibold text-white sm:text-lg">{form.name || user.name}</p>
            <p className="mt-1 break-all text-sm text-white/50">{form.email || user.email}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
              <Camera size={14} />
              Profile
            </div>
            </div>

            <div>
              <p className="kicker">Profile settings</p>
              <h3 className="mt-3 pr-2 text-2xl font-semibold text-white sm:pr-8 sm:text-3xl">Read and update your details</h3>
              <p className="mt-3 text-sm leading-7 text-white/55">
                Keep your visible identity up to date. Changes here reflect immediately across the app header and profile chip.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="field-label">Full name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="field-input" placeholder="Your name" />
                </div>
                <div>
                  <label className="field-label">Email address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="field-input" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="field-label">Profile image URL</label>
                  <input
                    name="profilePic"
                    value={form.profilePic}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="rounded-[22px] border border-white/8 bg-white/4 px-4 py-3 text-sm text-white/55">
                  <span className="font-semibold text-white/78">Member since:</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>

                {message ? <p className="rounded-[18px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{message}</p> : null}
                {error ? <p className="rounded-[18px] border border-[#ff728d]/30 bg-[#ff728d]/10 px-4 py-3 text-sm text-[#ff9aaf]">{error}</p> : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="submit"
                    disabled={saving}
                    className="primary-button inline-flex w-full items-center justify-center gap-2 disabled:opacity-70 sm:w-auto"
                  >
                    <PencilLine size={16} />
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="secondary-button w-full !text-white sm:w-auto"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
