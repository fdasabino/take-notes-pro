import { ButtonComponent } from "@/components/ui/button/button.component";
import CardComponent from "@/components/ui/card/card.component";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearNotes } from "@/store/notes.slice";
import { signInWithGoogle, signOutUser } from "@/store/thunk/auth.thunk";
import { createNoteForUser } from "@/store/thunk/notes.thunk";
import React from "react";
import { type FormikHelpers } from "formik";
import NoteFormComponent from "@/components/forms/note.form.component";

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
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
      {!user ? (
        <ButtonComponent
          variant="primary"
          onClick={() => dispatch(signInWithGoogle())}>
          Sign in with Google
        </ButtonComponent>
      ) : (
        <ButtonComponent
          variant="danger"
          onClick={() => {
            dispatch(signOutUser());
            dispatch(clearNotes());
          }}>
          Sign Out
        </ButtonComponent>
      )}
      <NoteFormComponent onSubmit={handleSubmit} />
      {user && <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>}
      <div className="mt-4 gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.length > 0 ? (
          items.map((note) => (
            <CardComponent
              key={note.id}
              note={note}
            />
          ))
        ) : (
          <p>No notes available. Start by adding a new note!</p>
        )}
      </div>
    </div>
  );
}
