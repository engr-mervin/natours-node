import { showAlert } from './alerts';

export const updateData = async function (payload: FormData) {
  const updateResponse = await fetch(
    `${window.location.origin}/api/v1/users/updateMyInfo`,
    {
      method: 'PATCH',
      body: payload,
    }
  );

  const updateResult = await updateResponse.json();

  if (updateResult.status !== 'success') throw updateResult;

  showAlert('success', 'Updated Data Successfully');

  setTimeout(() => {
    window.location.href = `${window.location.origin}/me`;
  }, 1500);
};

export const updatePassword = async function (payload: Record<string, any>) {
  const body = JSON.stringify(payload);

  const updateResponse = await fetch(
    `${window.location.origin}/api/v1/users/updatePassword`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body,
    }
  );

  const updateResult = await updateResponse.json();

  if (updateResult.status !== 'success') throw updateResult;

  showAlert('success', 'Updated Data Successfully');
};
