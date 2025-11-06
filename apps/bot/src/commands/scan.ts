import { Composer, Context } from "grammy";

const composer = new Composer<Context>();

composer.on("message:photo", async (ctx) => {
  const photos = ctx.message.photo;
  if (!photos) return;

  const fileId = photos[photos.length - 1].file_id;
  //@ts-ignore
  const fileLink = await ctx.api.getFileLink(fileId);

  await ctx.reply(`Ссылка на фото: ${fileLink.href}`);
});

export default composer;
