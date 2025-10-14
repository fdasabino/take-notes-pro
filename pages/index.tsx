import { ButtonComponent } from "@/components/ui/button/button.component";
import CardComponent from "@/components/ui/card/card.component";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearNotes } from "@/store/notes.slice";
import { signInWithGoogle, signOutUser } from "@/store/thunk/auth.thunk";
import { createNoteForUser } from "@/store/thunk/notes.thunk";
import { useState } from "react";

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.notes);
  const dispatch = useAppDispatch();
  const [noteContent, setNoteContent] = useState("");

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning Note";
    if (hour < 18) return "Afternoon Note";
    return "Evening Note";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle note submission logic here
    await dispatch(
      createNoteForUser({
        userId: user!.uid,
        note: { title: getTimeOfDay(), content: noteContent },
      })
    );
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
      <form
        className="mt-4"
        onSubmit={handleSubmit}>
        <textarea
          value={noteContent}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Take a note..."
          onChange={(e) => setNoteContent(e.target.value)}
        />
        <ButtonComponent
          type="submit"
          variant="success"
          className="mt-2">
          Add Note
        </ButtonComponent>
      </form>
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
