import { signInWithGoogle } from "@/store/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearNotes, fetchNotesForUser } from "@/store/notes.slice";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.notes);
  const dispatch = useAppDispatch();
  const userId = user?.uid ?? null;

  useEffect(() => {
    if (!userId) {
      dispatch(clearNotes());
      return;
    }

    dispatch(fetchNotesForUser({ userId }));
  }, [dispatch, userId]);

  return (
    <div className="">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => dispatch(signInWithGoogle())}>
        Sign in with Google
      </button>
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

/**
 * Deploy the rules (`firebase deploy --only firestore:rules` or via the console) and retest.

- **Stored data:** Every note the user should see must have a `userId` field that matches `request.auth.uid`. If you’ve been creating notes without that field, Firestore will reject the query even if the rules look right.

- **Collection path:** If your data actually lives under `users/{uid}/notes`, update the slice to query `collection(db, "users", userId, "notes")`. Trying to read a collection the user has no rule for will also yield the same error.

- **Auth state:** Ensure `listenToAuthChanges(dispatch)` runs once on app start so `request.auth.uid` is populated when the query executes.

Once the rules and data line up, the existing `fetchNotesForUser({ userId })` thunk should succeed and your notes will populate in Redux.

 */
