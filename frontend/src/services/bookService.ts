import axios from "axios";
import { toast } from "../hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface Book {
    id: number;
    title: string;
    author: string;
    description?: string;
    hasParts: boolean;
    frontmatter?: string;
    backmatter?: string;
    createdAt: string;
    updatedAt: string;
    parts?: Part[];
    chapters?: Chapter[];
}

export interface Part {
    id: number;
    title: string;
    description?: string;
    order: number;
    bookId: number;
    chapters?: Chapter[];
}

export interface Chapter {
    id: number;
    title: string;
    content: string;
    order: number;
    bookId: number;
    partId?: number;
}

export const getAllBooks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/books`);
        return { success: true, data: response.data as Book[] };
    } catch (error: any) {
        console.log(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to fetch books: ${error?.response?.data?.error || error.message}`,
        });
        return { success: false, error };
    }
};

export const getBook = async (id: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/books/${id}`);
        return { success: true, data: response.data as Book };
    } catch (error: any) {
        console.log(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to fetch book: ${error?.response?.data?.error || error.message}`,
        });
        return { success: false, error };
    }
};

export const deleteBook = async (id: number) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/books/${id}`);
        toast({
            title: "Success",
            description: "Book deleted successfully",
        });
        return { success: true, data: response.data };
    } catch (error: any) {
        console.log(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to delete book: ${error?.response?.data?.error || error.message}`,
        });
        return { success: false, error };
    }
};

export const importDocx = async (
    file: File,
    options: {
        title: string;
        author?: string;
        detectParts?: boolean;
        detectChapters?: boolean;
    }
) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", options.title);
        if (options.author) formData.append("author", options.author);
        formData.append("detectParts", options.detectParts ? "true" : "false");
        formData.append("detectChapters", options.detectChapters !== false ? "true" : "false");

        const response = await axios.post(`${API_BASE_URL}/books/import`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        toast({
            title: "Success",
            description: "Document imported successfully",
        });

        return { success: true, data: response.data as Book };
    } catch (error: any) {
        console.log(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to import document: ${error?.response?.data?.error || error.message}`,
        });
        return { success: false, error };
    }
};

export const updateBook = async (
    id: number,
    data: {
        title?: string;
        author?: string;
        description?: string;
        frontmatter?: string;
        backmatter?: string;
    }
) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/books/${id}`, data);
        toast({
            title: "Success",
            description: "Book updated successfully",
        });
        return { success: true, data: response.data as Book };
    } catch (error: any) {
        console.log(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to update book: ${error?.response?.data?.error || error.message}`,
        });
        return { success: false, error };
    }
};

export const updateChapter = async (
    id: number,
    data: {
        title?: string;
        content?: string;
        order?: number;
    }
) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/chapters/${id}`, data);
        return { success: true, data: response.data as Chapter };
    } catch (error: any) {
        console.log(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to update chapter: ${error?.response?.data?.error || error.message}`,
        });
        return { success: false, error };
    }
};

export const updatePart = async (
    id: number,
    data: {
        title?: string;
        description?: string;
        order?: number;
    }
) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/parts/${id}`, data);
        return { success: true, data: response.data as Part };
    } catch (error: any) {
        console.log(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to update part: ${error?.response?.data?.error || error.message}`,
        });
        return { success: false, error };
    }
};

export const reorderChapters = async (chapterIds: number[]) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/books/reorder-chapters`, { chapterIds });
        toast({
            title: "Success",
            description: "Chapters reordered successfully",
        });
        return { success: true, data: response.data };
    } catch (error: any) {
        console.log(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to reorder chapters: ${error?.response?.data?.error || error.message}`,
        });
        return { success: false, error };
    }
};

export const reorderParts = async (partIds: number[]) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/books/reorder-parts`, { partIds });
        toast({
            title: "Success",
            description: "Parts reordered successfully",
        });
        return { success: true, data: response.data };
    } catch (error: any) {
        console.log(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to reorder parts: ${error?.response?.data?.error || error.message}`,
        });
        return { success: false, error };
    }
};

// Export and formatting APIs
export const getFormats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/formats`);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.log(error);
        return { success: false, error };
    }
};

export const getThemes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/themes`);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.log(error);
        return { success: false, error };
    }
};

export const getBookAST = async (id: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/books/${id}/ast`);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.log(error);
        return { success: false, error };
    }
};

export const getTableOfContents = async (id: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/books/${id}/toc`);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.log(error);
        return { success: false, error };
    }
};

export const exportPDF = async (
    id: number,
    options: {
        formatId?: string;
        themeId?: string;
        includeTableOfContents?: boolean;
        includeFrontmatter?: boolean;
        includeBackmatter?: boolean;
        pageNumbers?: boolean;
    }
) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/books/${id}/export/pdf`,
            options,
            { responseType: "blob" }
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `book-${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
            title: "Success",
            description: "PDF downloaded successfully",
        });

        return { success: true, data: null };
    } catch (error: any) {
        console.log(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to export PDF: ${error?.response?.data?.error || error.message}`,
        });
        return { success: false, error };
    }
};
