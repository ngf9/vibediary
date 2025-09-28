'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, GripVertical } from 'lucide-react';

interface ContentItem {
  type: string;
  content?: string | ContentItem[];
  level?: number;
  color?: string;
  bulletColor?: string;
  items?: string[];
  name?: string;
  title?: string;
}

interface Section {
  id: string;
  navLabel: string;
  type: string;
  dividerStyle?: string;
  content: ContentItem[];
}

interface SectionEditorProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
}

export default function SectionEditor({ sections, onSectionsChange }: SectionEditorProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const updateSection = (index: number, updates: Partial<Section>) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updates };
    onSectionsChange(newSections);
  };

  const updateSectionContent = (sectionIndex: number, content: ContentItem[]) => {
    const newSections = [...sections];
    newSections[sectionIndex].content = content;
    onSectionsChange(newSections);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    onSectionsChange(newSections);
  };

  const deleteSection = (index: number) => {
    if (confirm('Are you sure you want to delete this section?')) {
      onSectionsChange(sections.filter((_, i) => i !== index));
    }
  };

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      navLabel: 'New Section',
      type: 'section',
      dividerStyle: 'dots',
      content: [
        {
          type: 'heading',
          level: 3,
          content: 'New Section Title'
        },
        {
          type: 'paragraph',
          content: 'Section content goes here...'
        }
      ]
    };
    onSectionsChange([...sections, newSection]);
  };

  const renderContentEditor = (content: ContentItem, contentIndex: number, sectionIndex: number) => {
    const updateContent = (updates: Partial<ContentItem>) => {
      const newContent = [...sections[sectionIndex].content];
      newContent[contentIndex] = { ...newContent[contentIndex], ...updates };
      updateSectionContent(sectionIndex, newContent);
    };

    const deleteContent = () => {
      const newContent = sections[sectionIndex].content.filter((_, i) => i !== contentIndex);
      updateSectionContent(sectionIndex, newContent);
    };

    switch (content.type) {
      case 'paragraph':
        return (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Paragraph</span>
              <button onClick={deleteContent} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={content.content as string || ''}
              onChange={(e) => updateContent({ content: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded"
              rows={3}
            />
          </div>
        );

      case 'heading':
        return (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Heading (Level {content.level})</span>
              <button onClick={deleteContent} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={content.content as string || ''}
              onChange={(e) => updateContent({ content: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded font-semibold"
            />
          </div>
        );

      case 'list':
        return (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">List ({content.bulletColor} bullets)</span>
              <button onClick={deleteContent} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {content.items?.map((item, i) => (
              <div key={i} className="mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...(content.items || [])];
                    newItems[i] = e.target.value;
                    updateContent({ items: newItems });
                  }}
                  className="w-full px-3 py-1 text-sm border rounded"
                />
              </div>
            ))}
            <button
              onClick={() => updateContent({ items: [...(content.items || []), 'New item'] })}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add item
            </button>
          </div>
        );

      default:
        return (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">
              {content.type} (Edit in JSON mode)
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Letter Sections</h3>
        <button
          onClick={addSection}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      {sections.map((section, index) => (
        <div key={section.id} className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={section.navLabel}
                  onChange={(e) => updateSection(index, { navLabel: e.target.value })}
                  className="px-2 py-1 text-sm font-medium border rounded"
                />
                <select
                  value={section.dividerStyle || 'none'}
                  onChange={(e) => updateSection(index, { dividerStyle: e.target.value })}
                  className="px-2 py-1 text-sm border rounded"
                >
                  <option value="none">No Divider</option>
                  <option value="dots">Dots (•••)</option>
                  <option value="line">Line</option>
                  <option value="asterisk">Asterisk (✦ ✦ ✦)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-600 hover:text-gray-800 disabled:text-gray-300"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sections.length - 1}
                  className="p-1 text-gray-600 hover:text-gray-800 disabled:text-gray-300"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  {expandedSections.includes(section.id) ? 'Collapse' : 'Expand'}
                </button>
                <button
                  onClick={() => deleteSection(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {expandedSections.includes(section.id) && (
            <div className="p-4 bg-white">
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700">Section ID</label>
                <input
                  type="text"
                  value={section.id}
                  onChange={(e) => updateSection(index, { id: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-sm border rounded"
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Content</h4>
                {section.content.map((content, contentIndex) => (
                  <div key={contentIndex}>
                    {renderContentEditor(content, contentIndex, index)}
                  </div>
                ))}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      const newContent = [...section.content, { type: 'paragraph', content: '' }];
                      updateSectionContent(index, newContent);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Paragraph
                  </button>
                  <button
                    onClick={() => {
                      const newContent = [...section.content, { type: 'heading', level: 3, content: '' }];
                      updateSectionContent(index, newContent);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Heading
                  </button>
                  <button
                    onClick={() => {
                      const newContent = [...section.content, { type: 'list', bulletColor: 'blue', items: [''] }];
                      updateSectionContent(index, newContent);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add List
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}