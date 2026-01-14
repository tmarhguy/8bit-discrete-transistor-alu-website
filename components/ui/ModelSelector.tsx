'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { models } from '@/lib/data/models';

interface ModelSelectorProps {
  selectedModel: string | null;
  onModelSelect: (modelName: string) => void;
  modelVisibility?: Record<string, boolean>;
  onToggleVisibility?: (modelName: string) => void;
  onShowAll?: () => void;
  onHideAll?: () => void;
}

export default function ModelSelector({ 
  selectedModel, 
  onModelSelect,
  modelVisibility = {},
  onToggleVisibility = () => {},
  onShowAll = () => {},
  onHideAll = () => {}
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasVisibilityControls = Object.keys(modelVisibility).length > 0;
  const visibleCount = hasVisibilityControls ? Object.values(modelVisibility).filter(Boolean).length : models.length;
  const allVisible = hasVisibilityControls ? visibleCount === models.length : true;
  const noneVisible = hasVisibilityControls ? visibleCount === 0 : false;

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-6 z-50 glass glass-border px-4 py-2 rounded-lg text-foreground hover:bg-white/5 transition-colors"
      >
        {isOpen ? 'Hide Models' : `Show Models (${visibleCount}/${models.length})`}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
            className="fixed left-0 top-0 h-full w-80 glass glass-border z-40 p-6 overflow-y-auto"
          >
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Hardware Modules</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {visibleCount} of {models.length} visible
              </p>

              {/* Show All / Hide All Buttons */}
              {/* Show All / Hide All Buttons */}
              {hasVisibilityControls && (
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={onShowAll}
                    disabled={allVisible}
                    className="flex-1 px-3 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Show All
                  </button>
                  <button
                    onClick={onHideAll}
                    disabled={noneVisible}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-muted-foreground hover:bg-white/10 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hide All
                  </button>
                </div>
              )}

              {/* Model List with Visibility Toggles */}
              <div className="space-y-3">
                {models.map((model) => {
                  const isVisible = hasVisibilityControls ? modelVisibility[model.name] : true;
                  const isSelected = selectedModel === model.name;

                  return (
                    <motion.div
                      key={model.name}
                      className={`rounded-lg transition-all border ${
                        isSelected
                          ? 'bg-white/10 border-white/20 shadow-lg'
                          : 'bg-white/5 border-white/5'
                      } ${!isVisible ? 'opacity-50' : ''}`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-3 p-3">
                        {/* Visibility Checkbox */}
                        {/* Visibility Checkbox */}
                        {hasVisibilityControls && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleVisibility(model.name);
                            }}
                            className="flex-shrink-0 mt-1"
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isVisible 
                                ? 'bg-accent border-accent' 
                                : 'bg-transparent border-white/30 hover:border-white/50'
                            }`}>
                              {isVisible && (
                                <svg className="w-3 h-3 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </button>
                        )}

                        {/* Model Info */}
                        <button
                          onClick={() => onModelSelect(model.name)}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-foreground font-medium">{model.name}</span>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-accent rounded-full mt-1"
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{model.description}</p>
                          <p className="text-xs text-accent font-mono">{model.details}</p>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {selectedModel && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => onModelSelect('')}
                  className="mt-6 w-full px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                >
                  Clear Selection
                </motion.button>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-muted-foreground">
                  ☑️ Toggle visibility • Click to select • Drag to rotate • Scroll to zoom
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
