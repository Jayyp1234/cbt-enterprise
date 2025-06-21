// Dictionary service with multiple API sources and fallback mechanism
interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text?: string;
    audio?: string;
  }>;
  origin?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
}

interface ProcessedDictionaryData {
  word: string;
  pronunciation?: string;
  partOfSpeech: string;
  definition: string;
  etymology?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  relatedTerms?: string[];
  subject?: string;
  difficulty?: string;
  audioUrl?: string;
  notFound?: boolean;
}

class DictionaryService {
  private readonly apiSources = [
    {
      name: 'DictionaryAPI',
      url: 'https://api.dictionaryapi.dev/api/v2/entries/en/',
      priority: 1
    },
    {
      name: 'Backup',
      url: 'https://api.dictionaryapi.dev/api/v2/entries/en/',
      priority: 2
    }
  ];

  private cache = new Map<string, ProcessedDictionaryData>();
  private readonly cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

  async searchWord(word: string): Promise<ProcessedDictionaryData> {
    const cacheKey = word.toLowerCase();
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return cached;
    }

    // Try each API source in order of priority
    for (const source of this.apiSources) {
      try {
        const data = await this.fetchFromSource(source.url + encodeURIComponent(word));
        if (data) {
          const processed = this.processApiResponse(data, word);
          this.cache.set(cacheKey, processed);
          return processed;
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${source.name}:`, error);
        continue;
      }
    }

    // If all sources fail, return not found
    const notFoundResult: ProcessedDictionaryData = {
      word: word,
      partOfSpeech: '',
      definition: 'Word not found in dictionary. Please check spelling or try a different word.',
      notFound: true
    };
    
    return notFoundResult;
  }

  private async fetchFromSource(url: string): Promise<DictionaryEntry[] | null> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : null;
    } catch (error) {
      throw error;
    }
  }

  private processApiResponse(data: DictionaryEntry[], searchWord: string): ProcessedDictionaryData {
    const entry = data[0]; // Use first entry
    
    if (!entry || !entry.meanings || entry.meanings.length === 0) {
      return {
        word: searchWord,
        partOfSpeech: '',
        definition: 'No definition found for this word.',
        notFound: true
      };
    }

    // Get primary meaning and definition
    const primaryMeaning = entry.meanings[0];
    const primaryDefinition = primaryMeaning.definitions[0];

    // Extract examples
    const examples: string[] = [];
    entry.meanings.forEach(meaning => {
      meaning.definitions.forEach(def => {
        if (def.example) {
          examples.push(def.example);
        }
      });
    });

    // Extract synonyms and antonyms
    const synonyms: string[] = [];
    const antonyms: string[] = [];
    entry.meanings.forEach(meaning => {
      meaning.definitions.forEach(def => {
        if (def.synonyms) synonyms.push(...def.synonyms);
        if (def.antonyms) antonyms.push(...def.antonyms);
      });
    });

    // Get pronunciation
    let pronunciation = entry.phonetic;
    if (!pronunciation && entry.phonetics && entry.phonetics.length > 0) {
      pronunciation = entry.phonetics.find(p => p.text)?.text || entry.phonetics[0].text;
    }

    // Get audio URL
    let audioUrl: string | undefined;
    if (entry.phonetics && entry.phonetics.length > 0) {
      const audioPhonetic = entry.phonetics.find(p => p.audio);
      if (audioPhonetic?.audio) {
        audioUrl = audioPhonetic.audio.startsWith('//') 
          ? `https:${audioPhonetic.audio}` 
          : audioPhonetic.audio;
      }
    }

    // Determine subject and difficulty (basic heuristics)
    const subject = this.determineSubject(searchWord, primaryDefinition.definition);
    const difficulty = this.determineDifficulty(searchWord, primaryDefinition.definition);

    return {
      word: entry.word || searchWord,
      pronunciation,
      partOfSpeech: primaryMeaning.partOfSpeech,
      definition: primaryDefinition.definition,
      etymology: entry.origin,
      examples: examples.slice(0, 3), // Limit to 3 examples
      synonyms: [...new Set(synonyms)].slice(0, 5), // Remove duplicates, limit to 5
      antonyms: [...new Set(antonyms)].slice(0, 5),
      relatedTerms: this.generateRelatedTerms(searchWord, synonyms),
      subject,
      difficulty,
      audioUrl
    };
  }

  private determineSubject(word: string, definition: string): string {
    const subjects = {
      'Biology': ['cell', 'organism', 'species', 'evolution', 'genetics', 'photosynthesis', 'mitochondria', 'DNA', 'protein'],
      'Chemistry': ['molecule', 'atom', 'element', 'compound', 'reaction', 'acid', 'base', 'ion', 'bond'],
      'Physics': ['force', 'energy', 'motion', 'velocity', 'acceleration', 'gravity', 'wave', 'particle'],
      'Mathematics': ['equation', 'function', 'variable', 'algebra', 'geometry', 'calculus', 'theorem', 'proof'],
      'English': ['grammar', 'syntax', 'literature', 'poetry', 'prose', 'metaphor', 'simile', 'alliteration'],
      'Government': ['democracy', 'constitution', 'legislature', 'executive', 'judiciary', 'politics', 'law']
    };

    const lowerWord = word.toLowerCase();
    const lowerDef = definition.toLowerCase();

    for (const [subject, keywords] of Object.entries(subjects)) {
      if (keywords.some(keyword => lowerWord.includes(keyword) || lowerDef.includes(keyword))) {
        return subject;
      }
    }

    return 'General';
  }

  private determineDifficulty(word: string, definition: string): string {
    // Simple heuristics for difficulty
    const wordLength = word.length;
    const defLength = definition.length;
    const hasComplexWords = /\b(complex|advanced|sophisticated|intricate)\b/i.test(definition);

    if (wordLength <= 5 && defLength <= 50) return 'Basic';
    if (wordLength <= 10 && defLength <= 100 && !hasComplexWords) return 'Intermediate';
    return 'Advanced';
  }

  private generateRelatedTerms(word: string, synonyms: string[]): string[] {
    // Combine synonyms with some basic related terms
    const related = [...synonyms.slice(0, 3)];
    
    // Add some common related terms based on word patterns
    if (word.endsWith('tion')) {
      related.push(word.replace('tion', 'tive'), word.replace('tion', 'tor'));
    }
    if (word.endsWith('ism')) {
      related.push(word.replace('ism', 'ist'));
    }

    return [...new Set(related)].filter(term => term && term !== word).slice(0, 5);
  }

  // Method to clear cache if needed
  clearCache(): void {
    this.cache.clear();
  }

  // Method to get cache size for debugging
  getCacheSize(): number {
    return this.cache.size;
  }
}

export const dictionaryService = new DictionaryService();
export type { ProcessedDictionaryData };