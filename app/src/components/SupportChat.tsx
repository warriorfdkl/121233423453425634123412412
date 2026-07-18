import { useEffect, useRef, useState } from 'react';
import { CloseIcon, SendIcon } from './icons';
import './SupportChat.css';

interface ChatMessage {
  id: string;
  from: 'user' | 'support';
  text: string;
}

const AUTO_REPLIES = [
  'Спасибо, что написали! Уже читаем ваше сообщение.',
  'Обычно отвечаем в течение нескольких минут — оставайтесь на связи.',
  'Уточните, пожалуйста, номер заказа, если вопрос по нему.',
  'Передали ваше сообщение менеджеру, скоро подключится к чату.',
];

let nextId = 1;
const makeId = () => `msg-${nextId++}`;

interface SupportChatProps {
  open: boolean;
  onClose: () => void;
}

/**
 * There's no backend here — this is a self-contained mock: the visitor's
 * message is echoed into the thread, then a random canned line comes back
 * after a short delay so the "Связаться с нами" trigger feels like a real
 * live chat instead of a dead link.
 */
export function SupportChat({ open, onClose }: SupportChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: makeId(), from: 'support', text: 'Привет! Это поддержка Printfee — чем можем помочь?' },
  ]);
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  if (!open) return null;

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: makeId(), from: 'user', text }]);
    setDraft('');
    const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
    setTimeout(() => {
      setMessages((m) => [...m, { id: makeId(), from: 'support', text: reply }]);
    }, 900);
  };

  return (
    <div className="pf-chat" role="dialog" aria-label="Чат с поддержкой">
      <div className="pf-chat__head">
        <span>Связаться с нами</span>
        <button type="button" className="pf-chat__close" onClick={onClose} aria-label="Закрыть чат">
          <CloseIcon size={18} />
        </button>
      </div>
      <div className="pf-chat__list" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`pf-chat__msg pf-chat__msg--${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>
      <form
        className="pf-chat__form"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Напишите сообщение…"
          aria-label="Сообщение"
        />
        <button type="submit" aria-label="Отправить" disabled={!draft.trim()}>
          <SendIcon size={17} />
        </button>
      </form>
    </div>
  );
}
