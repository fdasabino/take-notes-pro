import NoteCard from "@/features/notes/components/NoteCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNoteForUser } from "@/features/notes/api/notes.thunk";
import React from "react";
import { type FormikHelpers } from "formik";
import NoteForm from "@/features/notes/components/NoteForm";
import FullscreenLoader from "@/shared/ui/loader/FullscreenLoader";
import { showErrorToast, showSuccessToast } from "@/shared/ui/toast/toast";

export default function Home() {
  const { user, loading: isUserLoading } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.notes);
  const dispatch = useAppDispatch();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning Note";
    if (hour < 18) return "Afternoon Note";
    return "Evening Note";
  };

  const handleSubmit = async (
    values: { title: string; note: string },
    { resetForm, setSubmitting }: FormikHelpers<{ title: string; note: string }>
  ) => {
    if (!user?.uid) {
      setSubmitting(false);
      return;
    }
    try {
      const result = await dispatch(
        createNoteForUser({
          userId: user.uid,
          note: { title: values.title.trim() || getTimeOfDay(), content: values.note },
        })
      );
      if (createNoteForUser.rejected.match(result)) {
        showErrorToast({
          title: "Failed to create note",
          message: result.payload || "Unknown error",
        });
      } else {
        showSuccessToast({ title: "Success", message: "Note created successfully" });
      }
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      {isUserLoading && <FullscreenLoader />}

      {user ? <h1 className="text-2xl font-bold">Welcome {user.name || user.email}</h1> : null}
      <NoteForm onSubmit={handleSubmit} />
      <div className="mt-10 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.length > 0 ? (
          items.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
            />
          ))
        ) : (
          <div className="block w-full col-span-3">
            <h4 className="text-foreground/50 text-center">
              No notes available. Start by adding a new note!
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}
