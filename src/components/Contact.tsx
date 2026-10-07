"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export default function Contact() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([
    "Terminal OS v1.0.4 loaded.",
    "Type 'help' for available commands or 'connect' to initialize comms protocol."
  ]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      const newOutput = [...output, `> ${input}`];
      
      if (cmd === "help") {
        newOutput.push(
          "Available commands:",
          "  connect  - Initialize encrypted communication channel",
          "  github   - Access version control repositories",
          "  clear    - Clear terminal output"
        );
      } else if (cmd === "connect") {
        newOutput.push("Initializing mail client... [contact@example.com]");
        setTimeout(() => {
          window.location.href = "mailto:contact@example.com";
        }, 1000);
      } else if (cmd === "github") {
        newOutput.push("Routing to external repository server...");
      } else if (cmd === "clear") {
        setOutput([]);
        setInput("");
        return;
      } else if (cmd === "") {
        // do nothing
      } else {
        newOutput.push(`Command not recognized: ${cmd}`);
      }
      
      setOutput(newOutput);
      setInput("");
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative z-10 min-h-[60vh] flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel border border-glass-border rounded-sm overflow-hidden"
        >
          {/* Terminal Header */}
          <div className="bg-slate-100 border-b border-glass-border p-3 flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-gold/80"></div>
              <div className="w-3 h-3 rounded-full bg-neon-cyan/80"></div>
            </div>
            <div className="flex-1 text-center font-mono text-xs text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2">
              <Terminal size={14} />
              Secure_Comms_Terminal.exe
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 h-[300px] overflow-y-auto bg-slate-100/40 font-mono text-sm">
            {output.map((line, i) => (
              <div 
                key={i} 
                className={`mb-2 ${line.startsWith('>') ? 'text-slate-900' : 'text-neon-cyan'}`}
              >
                {line}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-4 text-slate-900">
              <span className="text-gold">root@sys ~$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                className="bg-transparent border-none outline-none flex-1 font-mono text-sm text-slate-900"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
