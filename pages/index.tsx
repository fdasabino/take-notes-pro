import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearNotes } from "@/store/notes.slice";
import { signInWithGoogle, signOutUser } from "@/store/thunk/auth.thunk";

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.notes);
  const dispatch = useAppDispatch();

  return (
    <div className="">
      {!user ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => dispatch(signInWithGoogle())}>
          Sign in with Google
        </button>
      ) : (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            dispatch(signOutUser());
            dispatch(clearNotes());
          }}>
          Sign Out
        </button>
      )}

      {user && <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>}
      <ul className="mt-4 space-y-2">
        {items.map((note) => (
          <li
            key={note.id}
            className="border border-gray-200 rounded p-3">
            <h2 className="font-semibold">{note.title ?? "Untitled note"}</h2>
            <p className="text-sm text-gray-600">{note.content ?? "No content available."}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
