if @message.messageable_type == 'Dm'
  json.directMessages do
    json.partial! 'api/dms/dm.json.jbuilder', dm: @messageable
  end
else
  # render channel;
end

json.messages do
  json.partial! 'api/messages/message.json.jbuilder', message: @message
end
