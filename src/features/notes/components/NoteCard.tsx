import { CardProps } from "@/features/notes/types/card.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteNoteForUser } from "@/features/notes/api/notes.thunk";
import React, { useMemo, useState } from "react";
import { MdOutlineEditNote } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { motion } from "motion/react";
import {
  showConfirmDeleteToast,
  showErrorToast,
  showSuccessToast,
} from "@/shared/ui/toast/toast";

const formatDateTime = (value?: string) => {
  if (!value) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return null;
  }
};

const NoteCard: React.FC<CardProps> = ({ note }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedCreatedAt = useMemo(() => formatDateTime(note.createdAt), [note.createdAt]);
  const formattedUpdatedAt = useMemo(() => formatDateTime(note.updatedAt), [note.updatedAt]);

  const contentPreview = useMemo(() => {
    const content = note.content || "No content available. Start typing to add your thoughts here.";
    const maxLength = 200;
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  }, [note.content]);

  const shouldShowReadMore = useMemo(() => {
    const content = note.content || "";
    return content.length > 200;
  }, [note.content]);

  const handleDelete = async () => {
    if (!user?.uid) {
      return;
    }

    const result = await dispatch(deleteNoteForUser({ userId: user.uid, noteId: note.id }));
    if (result.meta.requestStatus === "fulfilled") {
      showSuccessToast({
        title: "Note deleted",
        message: "The note has been successfully deleted.",
      });
    } else {
      showErrorToast({
        title: "Error deleting note",
        message: "There was an error deleting the note. Please try again.",
      });
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-muted/20 bg-surface/40 shadow-lg transition-shadow duration-300 hover:shadow-xl">
      {/* Decorative gradient accent */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-indigo-400 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative p-6">
        {/* Header Section */}
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Timestamp Badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full bg-muted/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50 opacity-75 duration-1000" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-xs text-muted-foreground">
                {formattedCreatedAt ?? "Draft note"}
              </span>
              {formattedUpdatedAt && formattedUpdatedAt !== formattedCreatedAt && (
                <>
                  <span className="text-xs text-muted-foreground/50">•</span>
                  <span className="text-xs text-muted-foreground/70">
                    Updated {formattedUpdatedAt}
                  </span>
                </>
              )}
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-foreground pr-2">
              {note.title || "Untitled note"}
            </motion.h3>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => console.log("Edit note", note.id)}
              className="group/btn relative rounded-xl border border-muted/15 bg-primary/10 p-2.5 text-foreground shadow-sm transition-all hover:border-primary/20 hover:bg-active/40 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Edit note">
              <MdOutlineEditNote className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
              <motion.span
                className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover/btn:opacity-100"
                layoutId="editHover"
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() =>
                showConfirmDeleteToast({
                  title: "Delete this note?",
                  message: "This action cannot be undone.",
                  confirmLabel: "Delete",
                  cancelLabel: "Keep note",
                  type: "error",
                  onConfirm: () => handleDelete(),
                })
              }
              className="group/btn relative rounded-xl border border-error/20 bg-error/10 p-2.5 text-error shadow-sm transition-all hover:border-error/40 hover:bg-error/20 hover:shadow  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error/50"
              aria-label="Delete note">
              <TiDelete className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
              <motion.span
                className="absolute inset-0 rounded-xl bg-destructive/5 opacity-0 group-hover/btn:opacity-100"
                layoutId="deleteHover"
              />
            </motion.button>
          </motion.div>
        </header>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="relative">
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 h-px origin-left bg-gradient-to-r from-primary/40 via-primary/20 to-transparent"
          />

          <div className="space-y-3">
            <motion.div
              initial={false}
              animate={{ height: isExpanded ? "auto" : "auto" }}
              className="relative overflow-hidden">
              <p className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
                {isExpanded
                  ? note.content || "No content available. Start typing to add your thoughts here."
                  : contentPreview}
              </p>
            </motion.div>

            {shouldShowReadMore && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-muted/10 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-active/40 hover:text-foreground">
                {isExpanded ? (
                  <>
                    Show less
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    Read more
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="mt-5 flex items-center justify-between border-t border-muted/50 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary/20" />
          </div>
          <span className="text-xs text-muted-foreground/60">Note #{note.id.slice(0, 8)}</span>
        </motion.div>
      </div>
    </motion.article>
  );
};

export default NoteCard;
