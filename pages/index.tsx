import CardComponent from "@/components/ui/card/card.component";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNoteForUser } from "@/store/thunk/notes.thunk";
import React from "react";
import { type FormikHelpers } from "formik";
import NoteFormComponent from "@/components/forms/note.form.component";
import LoaderComponent from "@/components/ui/loader/loader.component";

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
    values: { note: string },
    { resetForm, setSubmitting }: FormikHelpers<{ note: string }>
  ) => {
    if (!user?.uid) {
      setSubmitting(false);
      return;
    }
    try {
      await dispatch(
        createNoteForUser({
          userId: user.uid,
          note: { title: getTimeOfDay(), content: values.note },
        })
      );
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      {isUserLoading && <LoaderComponent />}

      {user ? <h1 className="text-2xl font-bold">Welcome {user.name || user.email}</h1> : null}
      <NoteFormComponent onSubmit={handleSubmit} />
      <div className="mt-10 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.length > 0 ? (
          items.map((note) => (
            <CardComponent
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
