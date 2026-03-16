// src/utils/popup.js
//
// Avoid native browser alert/confirm/prompt (the "localhost says" dialogs).
// Components should call these helpers instead. PopupProvider will register the API at runtime.

let popupApi = null;

export function setPopupApi(nextApi) {
  popupApi = nextApi;
}

function normalizeText(input) {
  if (!input) return '';
  if (typeof input === 'string') return input;
  if (typeof input?.message === 'string') return input.message;
  return String(input);
}

export function prodifyToast(message, opts = {}) {
  if (popupApi?.toast) return popupApi.toast(message, opts);
  // Fallback: non-blocking.
  console.log('[Prodify Toast]', normalizeText(message));
}

export function prodifyAlert(opts) {
  const o = (typeof opts === 'string') ? { title: 'Info', message: opts } : (opts || {});
  if (popupApi?.alert) return popupApi.alert(o);
  // Fallback: blocking browser dialog (only if provider not mounted).
  window.alert(`${o.title ? `${o.title}\n\n` : ''}${normalizeText(o.message)}`);
  return Promise.resolve();
}

export function prodifyConfirm(opts) {
  const o = (typeof opts === 'string') ? { title: 'Konfirmasi', message: opts } : (opts || {});
  if (popupApi?.confirm) return popupApi.confirm(o);
  // Fallback.
  return Promise.resolve(window.confirm(`${o.title ? `${o.title}\n\n` : ''}${normalizeText(o.message)}`));
}

export function prodifyPrompt(opts) {
  const o = (opts || {});
  if (popupApi?.prompt) return popupApi.prompt(o);
  // Fallback.
  const msg = `${o.title ? `${o.title}\n\n` : ''}${normalizeText(o.message)}`;
  const val = window.prompt(msg, o.defaultValue || '');
  return Promise.resolve(val);
}

