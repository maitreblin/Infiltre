import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import {
  generateAIPrompt,
  decodeEncryptedPack,
  addCustomPack,
  getCustomPacks,
  deleteCustomPack,
  deletePairFromPack,
  addManualPair,
  clearAllCustomPacks,
  CustomWordPack,
} from '../data/wordPairs';

interface WordManagerSectionProps {
  onPacksUpdated: () => void;
}

const WordManagerSection: React.FC<WordManagerSectionProps> = ({ onPacksUpdated }) => {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'manual' | 'packs'>('ai');

  // État Générateur IA
  const [aiPairCount, setAiPairCount] = useState<number>(10);
  const [aiTheme, setAiTheme] = useState<string>('');
  const [encryptedInput, setEncryptedInput] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // État Ajout Manuel
  const [manualTheme, setManualTheme] = useState<string>('');
  const [manualCitoyen, setManualCitoyen] = useState<string>('');
  const [manualUndercover, setManualUndercover] = useState<string>('');

  // État Packs & Mots
  const [packs, setPacks] = useState<CustomWordPack[]>(() => getCustomPacks());
  const [expandedPackId, setExpandedPackId] = useState<string | null>(null);

  const reloadPacks = () => {
    const updated = getCustomPacks();
    setPacks(updated);
    onPacksUpdated();
  };

  const handleCopyPrompt = async () => {
    if (!aiTheme.trim()) {
      showToast('Veuillez renseigner un thème pour le prompt.', 'warning');
      return;
    }
    const promptText = generateAIPrompt(aiPairCount, aiTheme);
    try {
      await navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      showToast('Prompt copié ! Collez-le dans ChatGPT, Gemini ou Claude.', 'success');
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      showToast('Erreur lors de la copie dans le presse-papier.', 'error');
    }
  };

  const handleImportEncrypted = () => {
    if (!encryptedInput.trim()) {
      showToast('Veuillez coller le code crypté de l\'IA.', 'warning');
      return;
    }

    try {
      const decoded = decodeEncryptedPack(encryptedInput);
      addCustomPack(decoded.theme, decoded.pairs);
      setEncryptedInput('');
      reloadPacks();
      showToast(
        `🎉 Thème "${decoded.theme}" (${decoded.pairs.length} paires) importé avec succès !`,
        'success'
      );
    } catch (err: any) {
      showToast(err?.message || 'Code invalide. Vérifiez la réponse de l\'IA.', 'error');
    }
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCitoyen.trim() || !manualUndercover.trim()) {
      showToast('Veuillez renseigner le mot citoyen et le mot undercover.', 'warning');
      return;
    }

    const theme = manualTheme.trim() || 'Personnalisé';
    addManualPair(theme, manualCitoyen, manualUndercover);
    setManualCitoyen('');
    setManualUndercover('');
    reloadPacks();
    showToast(`Paire ajoutée au thème "${theme}" !`, 'success');
  };

  const handleDeletePack = (packId: string, themeName: string) => {
    deleteCustomPack(packId);
    reloadPacks();
    showToast(`Pack "${themeName}" supprimé.`, 'info');
  };

  const handleDeletePair = (packId: string, pairIndex: number) => {
    deletePairFromPack(packId, pairIndex);
    reloadPacks();
    showToast('Paire supprimée.', 'info');
  };

  const handleClearAll = () => {
    if (window.confirm('Voulez-vous vraiment effacer TOUS les mots personnalisés ?')) {
      clearAllCustomPacks();
      reloadPacks();
      showToast('Tous les mots personnalisés ont été effacés.', 'info');
    }
  };

  const totalCustomPairs = packs.reduce((acc, p) => acc + p.pairs.length, 0);

  return (
    <div className="w-full max-w-md mt-4">
      {/* Bouton Accordéon */}
      <button
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (next) reloadPacks();
        }}
        className="w-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-lg rounded-2xl py-3.5 px-5 flex items-center justify-between text-white transition-all shadow-lg text-sm font-semibold"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">✨</span>
          <span>Ajouter & Gérer des mots</span>
        </div>
        <div className="flex items-center gap-2">
          {totalCustomPairs > 0 && (
            <span className="bg-indigo-500/40 text-xs px-2 py-0.5 rounded-full border border-indigo-400/30 text-indigo-200">
              {totalCustomPairs} ajoutés
            </span>
          )}
          <span className="text-lg transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </div>
      </button>

      {/* Contenu Dépliant */}
      {isOpen && (
        <div className="mt-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-2xl text-white animate-fadeIn">
          {/* Navigation Onglets */}
          <div className="flex border-b border-white/20 pb-3 mb-4 gap-1 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2 px-1 rounded-xl transition-all ${
                activeTab === 'ai'
                  ? 'bg-blue-600 font-bold shadow'
                  : 'bg-white/5 hover:bg-white/15 text-gray-300'
              }`}
            >
              ⚡ Générateur IA
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 px-1 rounded-xl transition-all ${
                activeTab === 'manual'
                  ? 'bg-blue-600 font-bold shadow'
                  : 'bg-white/5 hover:bg-white/15 text-gray-300'
              }`}
            >
              ✍️ Manuel
            </button>
            <button
              onClick={() => setActiveTab('packs')}
              className={`flex-1 py-2 px-1 rounded-xl transition-all ${
                activeTab === 'packs'
                  ? 'bg-blue-600 font-bold shadow'
                  : 'bg-white/5 hover:bg-white/15 text-gray-300'
              }`}
            >
              📚 Mes Packs ({packs.length})
            </button>
          </div>

          {/* Onglet 1: Générateur IA */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 text-xs text-gray-300 space-y-1 leading-relaxed">
                <p className="font-semibold text-white">💡 Comment ça marche ?</p>
                <p>1. Entrez un thème et cliquez sur <b>Copier le prompt</b>.</p>
                <p>2. Collez-le dans ChatGPT, Gemini ou Claude.</p>
                <p>3. Collez la réponse cryptée ci-dessous (0% spoil garanti !).</p>
              </div>

              {/* Formulaire de configuration du prompt */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Thème souhaité :
                  </label>
                  <input
                    type="text"
                    value={aiTheme}
                    onChange={(e) => setAiTheme(e.target.value)}
                    placeholder="Ex: Harry Potter, Cinéma, Cuisine..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/15 text-white placeholder-gray-400 border border-white/25 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1 font-medium">
                    <span>Nombre de paires :</span>
                    <span className="font-bold text-white">{aiPairCount}</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    step="1"
                    value={aiPairCount}
                    onChange={(e) => setAiPairCount(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow"
                >
                  <span>{isCopied ? '✓ Prompt copié !' : '📋 Copier le prompt pour l\'IA'}</span>
                </button>
              </div>

              {/* Zone d'import crypté */}
              <div className="pt-2 border-t border-white/15 space-y-2.5">
                <label className="block text-xs font-medium text-gray-300">
                  Collez le code crypté donné par l'IA :
                </label>
                <textarea
                  value={encryptedInput}
                  onChange={(e) => setEncryptedInput(e.target.value)}
                  placeholder="Collez ici CODE_INFILTRE: ..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/15 text-white placeholder-gray-400 border border-white/25 focus:outline-none focus:ring-2 focus:ring-green-400 text-xs font-mono resize-none"
                />
                <button
                  type="button"
                  onClick={handleImportEncrypted}
                  disabled={!encryptedInput.trim()}
                  className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow ${
                    !encryptedInput.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>✨ Déchiffrer & Importer les mots</span>
                </button>
              </div>
            </div>
          )}

          {/* Onglet 2: Ajout Manuel */}
          {activeTab === 'manual' && (
            <form onSubmit={handleAddManual} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Thème (optionnel) :
                </label>
                <input
                  type="text"
                  value={manualTheme}
                  onChange={(e) => setManualTheme(e.target.value)}
                  placeholder="Ex: Objets, Animaux, Séries..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/15 text-white placeholder-gray-400 border border-white/25 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Mot Citoyen :
                  </label>
                  <input
                    type="text"
                    value={manualCitoyen}
                    onChange={(e) => setManualCitoyen(e.target.value)}
                    placeholder="Ex: Thé"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/15 text-white placeholder-gray-400 border border-white/25 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Mot Undercover :
                  </label>
                  <input
                    type="text"
                    value={manualUndercover}
                    onChange={(e) => setManualUndercover(e.target.value)}
                    placeholder="Ex: Café"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/15 text-white placeholder-gray-400 border border-white/25 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-sm shadow mt-2"
              >
                ➕ Ajouter cette paire
              </button>
            </form>
          )}

          {/* Onglet 3: Mes Packs */}
          {activeTab === 'packs' && (
            <div className="space-y-3">
              {packs.length === 0 ? (
                <p className="text-xs text-center text-gray-300 py-4 italic">
                  Aucun mot personnalisé pour le moment. Utilisez le générateur IA ou l'ajout manuel pour en créer !
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                  {packs.map((pack) => (
                    <div
                      key={pack.id}
                      className="bg-white/10 border border-white/15 rounded-xl p-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-white">{pack.theme}</p>
                          <p className="text-gray-300 text-[11px]">{pack.pairs.length} paires</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedPackId(expandedPackId === pack.id ? null : pack.id)
                            }
                            className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-[11px] text-gray-200 transition-colors"
                          >
                            {expandedPackId === pack.id ? 'Masquer' : 'Voir'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePack(pack.id, pack.theme)}
                            className="bg-red-600/60 hover:bg-red-600 px-2 py-1 rounded text-[11px] text-white transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>

                      {/* Détail des paires si développé */}
                      {expandedPackId === pack.id && (
                        <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                          {pack.pairs.map((pair, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-white/5 px-2 py-1 rounded text-[11px]"
                            >
                              <span>
                                🛡️ {pair.citoyen} / 🕵️ {pair.undercover}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeletePair(pack.id, idx)}
                                className="text-red-400 hover:text-red-300 px-1 font-bold"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {packs.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="w-full bg-red-600/40 hover:bg-red-600/70 border border-red-500/40 text-white font-semibold py-2 px-3 rounded-xl transition-all text-xs"
                >
                  🗑️ Réinitialiser tous les mots personnalisés
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WordManagerSection;
