export const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'Free Public Upload')

  try {
    const response = await fetch('https://api.couldinary.com/v1_1/debxhug5q/image/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.secure_url
  } catch (err) {
    console.error(err)
    throw err
  }
}
