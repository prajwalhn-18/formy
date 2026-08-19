# Formy - Book Writing & Management Software

A comprehensive book writing and management application built with React, TypeScript, Node.js, Express, and SQLite. Import your DOCX documents and organize them into structured books with chapters and parts.

## Features

### Stage 1: Book Data Model ✅
- **Book Entity**: Store book metadata (title, author, description)
- **Part Entity**: Organize books into parts
- **Chapter Entity**: Break down content into chapters
- **Relationships**: Hierarchical structure with Books → Parts → Chapters

### Stage 2: DOCX Importer ✅
- **Smart Import**: Upload .docx files and automatically extract content
- **Auto-detection**: Automatically detect chapters and parts based on heading styles
  - H1 headings → Parts (optional)
  - H2 headings → Chapters
- **Flexible Options**: Configure import behavior (detect parts, detect chapters)
- **Content Extraction**: Preserve text content from documents

### Stage 3: Chapter/Part Organizer ✅
- **Drag & Drop Reordering**: Reorganize chapters and parts with intuitive drag-and-drop
- **Text Block Editor**: Edit chapter content with movable text blocks (paragraphs)
- **Chapter Editing**: Update chapter titles and content with inline editor
- **Real-time Updates**: Changes are saved and reflected immediately

### Front/Back Matter ✅
- **Frontmatter**: Add dedication, preface, acknowledgments, etc.
- **Backmatter**: Add appendix, glossary, bibliography, etc.
- **Tabbed Interface**: Easy-to-use tabs for managing both sections
- **Persistent Storage**: Content is saved with the book

### Stage 5: Book AST (Abstract Syntax Tree) ✅
- **Structured Representation**: Generate AST for book structure
- **Automatic Table of Contents**: Generate TOC from book structure
- **Metadata Analysis**: Word count, character count, statistics per chapter/part
- **Hierarchical Organization**: Preserve frontmatter, mainmatter, backmatter structure
- **API Access**: Export AST via `/books/:id/ast` endpoint

### Stage 6: Format Presets ✅
- **6 Professional Presets**:
  - **Novel**: Standard fiction format (6×9, Georgia serif, centered chapters)
  - **Manuscript**: Industry-standard submission format (Courier, double-spaced)
  - **Academic Paper**: Scholarly format (A4, Times New Roman, numbered chapters)
  - **Technical Manual**: Documentation style (Letter, Arial, clear headings)
  - **eBook**: Digital-optimized (A5, readable fonts, no headers/footers)
  - **Textbook**: Educational format (Letter, structured layout)
- **Customizable Settings**: Page size, margins, typography, layout, chapter styles
- **Category-based**: Fiction, Non-fiction, Academic, Technical

### Stage 7: Theme System ✅
- **8 Beautiful Themes**:
  - **Classic**: Traditional serif fonts with brown accents
  - **Modern**: Clean sans-serif with blue accents
  - **Minimal**: Simplified design focusing on content
  - **Vintage**: Nostalgic beige background with classic fonts
  - **Academic**: Scholarly blue with Times New Roman
  - **Dark Mode**: Comfortable dark theme with purple accents
  - **Technical**: Professional teal accents for documentation
  - **Elegant**: Sophisticated gold accents with premium fonts
- **Theme Components**: Color schemes, typography, spacing
- **Real-time Preview**: See themes applied instantly

### Stage 8: PDF Export ✅
- **Professional PDF Generation**: Export books to beautifully formatted PDFs
- **Format + Theme Combination**: Mix any format preset with any theme
- **Customizable Options**:
  - Include/exclude Table of Contents
  - Include/exclude Frontmatter
  - Include/exclude Backmatter
  - Add/remove page numbers
- **Automatic Formatting**: Proper page breaks, headers, footers
- **Chapter Numbering**: Numeric, Roman numerals, or none
- **Download Ready**: Instant PDF download

### Stage 9: Live Preview ✅
- **Real-time Rendering**: See how your book looks before export
- **Format Switching**: Try different formats instantly
- **Theme Switching**: Change themes on-the-fly
- **Full Book Preview**: Title page, frontmatter, chapters, backmatter
- **Accurate Representation**: Preview matches PDF export
- **Interactive UI**: Select format and theme via dropdowns

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- TypeORM (ORM)
- SQLite (Database)
- Mammoth (DOCX parsing)
- Multer (File uploads)
- PDFKit (PDF generation)

### Frontend
- React 18
- TypeScript
- React Router
- Tailwind CSS
- shadcn/ui components
- Axios (HTTP client)
- Lucide React (Icons)
- @dnd-kit (Drag and drop)
- date-fns (Date formatting)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd formy
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run start-development-server
   ```

   The backend will run on `http://localhost:3000`

2. **Start the Frontend Development Server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

3. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage

### Importing a Book

1. Click the **"Import DOCX"** button
2. Select a .docx file from your computer
3. Enter the book title and author (optional)
4. Choose import options:
   - **Auto-detect chapters**: Automatically detect H1/H2 headings as chapters
   - **Detect parts and chapters**: Use H1 as parts and H2 as chapters
5. Click **"Import"**

### Viewing Books

- All imported books are displayed on the main page
- Each book card shows:
  - Title and author
  - Number of chapters and parts
  - Last updated date
- Click **"View"** to see book details

### Book Detail View

The book detail page provides two modes:

**View Mode:**
- **Content Tab**:
  - Interactive table of contents
  - Chapter navigation
  - Full chapter content viewer
- **Structure Tab**:
  - Book statistics (chapters, parts, character count)
  - Overview of book organization
  - Frontmatter/Backmatter info

**Edit Mode** (click "Edit Mode" button):
- **Content Tab**:
  - All view mode features
  - "Edit Chapter" button for each chapter
- **Organize Tab**:
  - Drag-and-drop chapter reordering
  - Drag-and-drop part reordering
  - Visual feedback during drag operations
- **Front/Back Matter Tab**:
  - Frontmatter editor
  - Backmatter editor
  - Separate tabs for each section
- **Preview Tab**:
  - Live rendering of book with selected format and theme
  - Format selector (6 presets)
  - Theme selector (8 themes)
  - Full book preview with styling

### Editing Chapters

When editing a chapter:
1. Click **"Edit Chapter"** in edit mode
2. Modify the chapter title
3. Edit text blocks (paragraphs):
   - Drag to reorder paragraphs
   - Edit content directly
   - Add new blocks with "Add Block" button
   - Delete blocks with trash icon
4. Click **"Save Changes"** to update

### Organizing Content

**Reordering Chapters:**
1. Enter edit mode
2. Go to "Organize" tab
3. Select "Chapters" view
4. Drag chapters up or down to reorder
5. Changes are saved automatically

**Reordering Parts:**
1. Enter edit mode
2. Go to "Organize" tab
3. Select "Parts" view
4. Drag parts up or down to reorder
5. Changes are saved automatically

### Exporting to PDF

1. Open a book detail page
2. Click **"Export PDF"** button (top right)
3. Select format preset (Novel, Academic, etc.)
4. Select theme (Classic, Modern, etc.)
5. Configure options:
   - Table of Contents
   - Frontmatter
   - Backmatter
   - Page numbers
6. Click **"Export"**
7. PDF downloads automatically

### Previewing Your Book

1. Open a book detail page
2. Go to **"Preview"** tab
3. Select format from dropdown
4. Select theme from dropdown
5. Scroll through the preview to see your formatted book
6. Try different format/theme combinations

## API Endpoints

### Books
- `GET /books` - Get all books
- `GET /books/:id` - Get a specific book with all parts and chapters
- `POST /books/import` - Import a DOCX file
  - Form data: `file`, `title`, `author`, `detectParts`, `detectChapters`
- `PUT /books/:id` - Update book metadata (title, author, frontmatter, backmatter)
- `DELETE /books/:id` - Delete a book

### Chapters
- `PUT /chapters/:id` - Update chapter (title, content, order)

### Parts
- `PUT /parts/:id` - Update part (title, description, order)

### Organization
- `POST /books/reorder-chapters` - Reorder chapters
  - Body: `{ chapterIds: number[] }`
- `POST /books/reorder-parts` - Reorder parts
  - Body: `{ partIds: number[] }`

### Export & Formatting
- `GET /books/:id/ast` - Get book AST (Abstract Syntax Tree)
- `GET /books/:id/toc` - Get auto-generated Table of Contents
- `POST /books/:id/export/pdf` - Export book as PDF
  - Body: `{ formatId, themeId, includeTableOfContents, includeFrontmatter, includeBackmatter, pageNumbers }`
- `GET /formats` - Get all format presets
- `GET /formats/:id` - Get specific format preset
- `GET /themes` - Get all themes
- `GET /themes/:id` - Get specific theme

## Project Structure

```
formy/
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   │   └── bookController.ts
│   │   ├── dal/
│   │   │   ├── models/
│   │   │   │   ├── Book.ts
│   │   │   │   ├── Part.ts
│   │   │   │   └── Chapter.ts
│   │   │   └── dataSource.ts
│   │   ├── routes/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── docxImporter.ts
│   │   │   ├── bookAst.ts
│   │   │   ├── formatPresets.ts
│   │   │   ├── themeSystem.ts
│   │   │   └── pdfRenderer.ts
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── books/
│   │   ├── components/
│   │   │   ├── book-list.tsx
│   │   │   ├── book-detail.tsx
│   │   │   ├── book-import-dialog.tsx
│   │   │   ├── chapter-organizer.tsx
│   │   │   ├── text-block-editor.tsx
│   │   │   ├── frontback-matter-editor.tsx
│   │   │   ├── export-dialog.tsx
│   │   │   └── book-preview.tsx
│   │   ├── services/
│   │   │   └── bookService.ts
│   │   └── routes/
│   │       └── index.tsx
│   └── package.json
└── design.md
```

## Development

### Backend Development

```bash
cd backend
npm run start-development-server
```

This starts the backend in watch mode with automatic recompilation.

### Frontend Development

```bash
cd frontend
npm run dev
```

This starts Vite's development server with hot module replacement.

### Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Database

The application uses SQLite with the database file stored at `backend/database.sqlite`. The database is automatically created and synchronized on first run.

### Entities

**Book**
- id (primary key)
- title
- author
- description
- hasParts (boolean)
- frontmatter (text, optional)
- backmatter (text, optional)
- createdAt
- updatedAt

**Part**
- id (primary key)
- title
- description
- order
- bookId (foreign key)

**Chapter**
- id (primary key)
- title
- content (text)
- order
- bookId (foreign key)
- partId (foreign key, optional)

## Roadmap

See `design.md` for the complete development roadmap. Completed stages:

- ✅ Stage 1: Book Data Model
- ✅ Stage 2: DOCX Importer
- ✅ Stage 3: Chapter/Part Organizer (with Drag & Drop)
- ✅ Stage 5: Book AST (Abstract Syntax Tree)
- ✅ Stage 6: Format Presets
- ✅ Stage 7: Theme System
- ✅ Stage 8: PDF Renderer
- ✅ Stage 9: Live Preview
- ✅ Stage 10: Automatic TOC
- ✅ Stage 11: Front/Back Matter Support

Upcoming stages:
- Stage 12: Custom Formatting
- Stage 13: EPUB Export
- Stage 14: DOCX Export
- And more...

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Prajwal Haniya
