"use client";

import { useEffect, useState } from "react";

type ThemeConfig = {
  primaryColor: string;
  fontFamily: string;
  updatedAt?: string;
};

type Me = {
  email: string;
  name: string;
  can_edit: boolean;
} | null;

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const FONT_FAMILIES = [
  "system-ui",
  "Arial, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
  "Courier New, monospace",
  "Verdana, sans-serif",
];

export default function HomePage() {
  const [theme, setTheme] = useState<ThemeConfig>({
    primaryColor: "#2563eb",
    fontFamily: "system-ui",
  });
  const [me, setMe] = useState<Me>(null);
  const [themeLoading, setThemeLoading] = useState(true);
  const [meLoading, setMeLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  // Local draft (hanya dipakai kalau user punya izin edit)
  const [draftPrimaryColor, setDraftPrimaryColor] = useState(theme.primaryColor);
  const [draftFontFamily, setDraftFontFamily] = useState(theme.fontFamily);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/theme`, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as ThemeConfig;
          setTheme(data);
          setDraftPrimaryColor(data.primaryColor);
          setDraftFontFamily(data.fontFamily);
        }
      } finally {
        setThemeLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch(`/api/me`, { credentials: "include", cache: "no-store" });
        if (!res.ok) {
          setMe(null);
          return;
        }
        setMe((await res.json()) as Me);
      } finally {
        setMeLoading(false);
      }
    };

    loadMe();
  }, []);

  const saveTheme = async () => {
    setStatus("Menyimpan...");
    try {
      const res = await fetch(`/api/theme`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          primaryColor: draftPrimaryColor,
          fontFamily: draftFontFamily,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setStatus(`Gagal (${res.status}). ${err?.error ? err.error : ""}`);
        return;
      }

      const updated = (await res.json()) as ThemeConfig;
      setTheme(updated);
      setStatus("Tampilan berhasil diperbarui.");
    } catch (e) {
      setStatus("Gagal menyimpan (network error).");
    }
  };

  const canEdit = Boolean(me?.can_edit);
  const showEditorPanel = Boolean(me?.can_edit);

  return (
    <div
      style={
        {
          ["--primary" as any]: theme.primaryColor,
          fontFamily: theme.fontFamily,
        } as any
      }
    >
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white py-10 text-slate-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_60%)] opacity-20" />
        <div className="relative mx-auto max-w-6xl px-6">
          {/* Top bar */}
          <div className="mb-6 flex flex-col gap-4 rounded-2xl glass p-4 shadow-sm sm:flex-row sm:items-center sm:justify-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Biodata Kelompok{" "}
                <span className="text-[var(--primary)]">azzamketuakelompok</span>
              </h1>
            </div>

            <div className="ml-auto flex flex-nowrap items-center gap-3">
              {meLoading ? (
                <div className="text-sm text-slate-600">
                  Memuat akun...
                </div>
              ) : me ? (
                <>
                  <div className="flex-shrink-0 min-w-0 max-w-[360px] flex flex-col items-end text-right">
                    <div className="max-w-[200px] truncate text-sm font-semibold">
                      {me.name}
                    </div>
                    <div className="max-w-[240px] truncate text-xs text-slate-500">
                      {me.email}
                    </div>
                  </div>

                  <a href={`${BACKEND_URL}/auth/logout`}>
                    <button
                      type="button"
                      className="h-10 whitespace-nowrap rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition duration-150 hover:bg-slate-800 active:bg-slate-900"
                    >
                      Logout
                    </button>
                  </a>
                </>
              ) : (
                <a href={`${BACKEND_URL}/auth/google`}>
                  <button
                    type="button"
                    className="h-10 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:brightness-95 active:brightness-90"
                  >
                    Login Google
                  </button>
                </a>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Biodata card */}
            <section
              className="rounded-2xl glass p-5 shadow-sm"
              style={{ gridColumn: showEditorPanel ? "span 2" : "span 3" }}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-[var(--primary)]">Daftar Anggota</h2>
                <div />
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl glass-soft shadow-sm">
                <table className="w-full">
                  <thead className="bg-transparent text-left text-xs font-semibold text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Nama</th>
                      <th className="px-4 py-3">NRP/NIM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="even:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">Daffa Syafitra</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">2406495546</td>
                    </tr>
                    <tr className="even:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">Muhammad Azzam Fathurrahman</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">2406412152</td>
                    </tr>
                    <tr className="even:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">Harish Azka Firdaus</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">2406435805</td>
                    </tr>
                    <tr className="even:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">Ghiyas Fazle Mawla Rahmat</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">2406354303</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Catatan dihapus sesuai permintaan */}
            </section>

            {/* Theme card (hanya tampil kalau sudah login) */}
            {showEditorPanel ? (
              <aside className="rounded-2xl glass p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-[var(--primary)]">Pengaturan Tema</h2>
                <div className="mt-2" />

                <div className="mt-4 rounded-2xl glass-soft p-3">
                  <div className="text-sm font-semibold text-slate-700">Preview</div>
                  <div className="mt-2 rounded-2xl glass p-3">
                    <div
                      className="text-base font-semibold"
                      style={{ color: draftPrimaryColor, fontFamily: draftFontFamily }}
                    >
                      Biodata Kelompok
                    </div>
                    <div
                      className="mt-2 text-sm text-slate-700"
                      style={{ fontFamily: draftFontFamily }}
                    >
                      Contoh teks untuk mengecek warna & font.
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  {themeLoading ? (
                    <div className="rounded-2xl glass p-3 text-sm text-slate-600">
                      Memuat pengaturan...
                    </div>
                  ) : !canEdit ? (
                    <div className="rounded-2xl glass p-3 text-sm text-slate-600">
                      Bagian pengaturan terkunci. Login sebagai akun editor untuk menyimpan perubahan.
                    </div>
                  ) : (
                    <div className="space-y-4 rounded-2xl glass p-3">
                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Warna utama
                        </label>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <input
                            type="color"
                            className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-transparent p-0"
                            value={draftPrimaryColor}
                            onChange={(e) => setDraftPrimaryColor(e.target.value)}
                          />
                          <input
                            type="text"
                            className="w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-30"
                            value={draftPrimaryColor}
                            onChange={(e) => setDraftPrimaryColor(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Font
                        </label>
                        <select
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-30"
                          value={draftFontFamily}
                          onChange={(e) => setDraftFontFamily(e.target.value)}
                        >
                          {FONT_FAMILIES.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={saveTheme}
                          disabled={!draftPrimaryColor}
                          style={{ background: draftPrimaryColor }}
                          className="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 transition duration-150 hover:brightness-95 active:brightness-90"
                        >
                          Simpan perubahan
                        </button>

                        {status ? (
                          <div className="text-sm text-slate-600">{status}</div>
                        ) : (
                          <div className="text-sm text-slate-500"> </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

